//https://leafletjs.com/reference-1.7.1.html#tilelayer
let basemapGray = L.tileLayer.provider('BasemapAT.grau');


//https://leafletjs.com/reference-1.7.1.html#map-exampl
let map = L.map("map", {
    fullscreenControl: true,
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});
let overlays = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    snowheight: L.featureGroup(),
    windspeed: L.featureGroup(),
    rHum: L.featureGroup(),
    winddirection: L.featureGroup()
};

//https://leafletjs.com/reference-1.7.1.html#layer
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BAsemapAT.overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Relative Luftfeuchtigkeit (%)": overlays.rHum,
    "Schneehöhe (cm)": overlays.snowheight,
    "Windgeschwindigkeit (km/h)": overlays.windspeed,
    "Windrichtung": overlays.winddirection
}, {
    collapsed: false
}).addTo(map);
overlays.temperature.addTo(map);

L.control.scale({
    imperial: false
}).addTo(map);

L.control.rainviewer({
    position: 'bottomright',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

let getColor = (value, colorRamp) => {
    //console.log("Wert:", value, "Palette:", colorRamp);
    for (let rule of colorRamp) {
        if (value >= rule.min && value < rule.max) {
            return rule.col;
        }
    }
    return "black";
};
let getDirection = (val, windRamp) => {
    for (let rule of windRamp) {
        if ((val >= rule.min) && (val < rule.max)) {
            return rule.dir;
        }
    }
};

let newLabel = (coords, options) => {
    let color = getColor(options.value, options.colors);
    //console.log("Wert", options.value, "bekommt Farbe", color);
    let label = L.divIcon({
        html: `<div style="background-color:${color}">${options.value}</div>`,
        className: "text-label"
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    return marker;
};
let WindLabel = (coords, options) => {
    let Direction = getDirection(options.value, options.directions);
    let label = L.divIcon({
        html: `<div>${Direction}</div>`,
        className: "text-label"
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]} m.ü.A)`
    });
    return marker;
}

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";


fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            // console.log('Station: ', station);
            let marker = L.marker([
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
    <h3>${station.properties.name}</h3>
    <ul>
        <li>Datum: ${formattedDate.toLocaleString("de")} Uhr</li>
        <li>Seehöhe: ${station.geometry.coordinates[2] ||"?"} m.ü.A.</li>
        <li>Temperatur: ${station.properties.LT||"?"} °C</li>
        <li>Relative Luftfeuchtigkeit: ${station.properties.RH||"?"} %</li>
        <li>Schneehöhe: ${station.properties.HS||"?"} cm</li>
        <li>Windgeschwindigkeit: ${station.properties.WG||"?"} km/h</li>
        <li>Windrichtung: ${station.properties.WR||"?"} °</li>
    </ul>
    <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
    `);
            marker.addTo(overlays.stations);
            //Schnee
            if (typeof station.properties.HS == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.HS.toFixed(0),
                    colors: COLORS.snowheight,
                    station: station.properties.name
                });
                marker.addTo(overlays.snowheight);

            }
            //Windgeschwindigkeit
            if (typeof station.properties.WG == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.WG.toFixed(0),
                    colors: COLORS.windspeed,
                    station: station.properties.name
                });
                marker.addTo(overlays.windspeed);
            }
            if (typeof station.properties.LT == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.LT.toFixed(1),
                    colors: COLORS.temperature,
                    station: station.properties.name
                });

                marker.addTo(overlays.temperature);
            }

            //Relative Luftfeuchtigkeit
            if (typeof station.properties.RH == 'number') {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.RH.toFixed(1),
                    colors: COLORS.rHum,
                    station: station.properties.name
                });
                marker.addTo(overlays.rHum);
            }

            //Windrichtung 
            if (typeof station.properties.WR == 'number') {
                let marker = WindLabel(station.geometry.coordinates, {
                    value: station.properties.WR,
                    directions: DIRECTIONS,
                    colors: DIRECTIONS.col,
                    station: station.properties.name
                });
                marker.addTo(overlays.winddirection);
            }
        }

        map.fitBounds(overlays.stations.getBounds());
    });

// minimap
var miniMap = new L.Control.MiniMap(L.tileLayer.provider("BasemapAT.basemap"), {
    toggleDisplay: true,
    minimized: true
}).addTo(map)