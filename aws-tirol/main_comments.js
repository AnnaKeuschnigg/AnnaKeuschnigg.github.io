//https://leafletjs.com/reference-1.7.1.html#tilelayer
// https://github.com/leaflet-extras/leaflet-providers
let basemapGray = L.tileLayer.provider('BasemapAT.grau');


//https://leafletjs.com/reference-1.7.1.html#map-exampl
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

//https://leafletjs.com/reference-1.7.1.html#layer
// https://leafletjs.com/reference-1.7.1.html#control-layers
// https://leafletjs.com/reference-1.7.1.html#layergroup
// https://leafletjs.com/reference-1.7.1.html#control-layers-addto
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BAsemapAT.overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

//https://leafletjs.com/reference-1.7.1.html#featuregroup
// https://leafletjs.com/reference-1.7.1.html#control-layers-addoverlay
// https://leafletjs.com/reference-1.7.1.html#featuregroup-addto
let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");
awsLayer.addTo(map);
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen");
let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit (km/h)");
let TempLayer = L.featureGroup();
layerControl.addOverlay(TempLayer, "Lufttemperatur (°C)");

fetch(awsUrl).then(response => response.json())
    .then(json => {
        console.log("Daten konvertiert: ", json);
        for (station of json.features) {
            // console.log('Station: ', station);
            // https://leafletjs.com/reference-1.7.1.html#marker
            // https://leafletjs.com/reference-1.7.1.html#marker-bindpopup
            // https://leafletjs.com/reference-1.7.1.html#marker-addto
            console.log("Station: ", station);
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
            marker.addTo(awsLayer);
            //Schnee
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                // https://leafletjs.com/reference-1.7.1.html#divicon
                // https://leafletjs.com/reference-1.7.1.html#marker-icon
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);

            }
            //Windgeschwindigkeit
            if (station.properties.WG) {
                let windHighlightClass = '';
                if (station.properties.WG > 10) {
                    windHighlightClass = 'wind-10';
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = 'wind-20';
                }
                let windIcon = L.divIcon({
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`
                });
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }
            if (station.properties.LT) {
                let tempHighlightClass = '';
                if (station.properties.LT > 0) {
                    tempHighlightClass = 'tempgr0';
                }
                if (station.properties.LT < 0) {
                    tempHighlightClass = 'tempkl0';
                }
                let tempIcon = L.divIcon({
                    html: `<div class="temp-label ${tempHighlightClass}">${station.properties.LT}</div>`
                });
                let tempMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0],
                ], {
                    icon: tempIcon
                });
                tempMarker.addTo(TempLayer);
            }
        }
        // https://leafletjs.com/reference-1.7.1.html#map-fitbounds
        // https://leafletjs.com/reference-1.7.1.html#featuregroup-getbounds
        map.fitBounds(awsLayer.getBounds());
    });