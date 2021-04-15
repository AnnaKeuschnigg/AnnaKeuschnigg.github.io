let basemapGray= L.tileLayer.provider('BasemapAT.grau')

let map= L.map("map", {
    center:[47,11],
    zoom:9,
    layers:[
        basemapGray
    ]
})

let layerControl= L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto":L.tilelayer.provider('BasemapAT.orthofoto'),
    "OpenRailwayMap":L.tilelayer.provider('OpenRailwayMap'),
    "BasemapAT.overlay":L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);