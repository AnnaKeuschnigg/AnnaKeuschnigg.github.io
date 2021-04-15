let basemapGray= L.tileLayer.provider('BasemapAT.grau')

let map= L.map("map", {
    center:[47,11],
    zoom:9,
    layers:[
        basemapGray
    ]
})
