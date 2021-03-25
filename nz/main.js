console.log("Hello World");
console.log(L);
let stop = {
    nr: 17,
    name: "Lake Rotoiti",
    lat: -41.8245,
    lng:  172.8381,
    user: "AnnaKeuschnigg",
    wikipedia: "https://en.wikipedia.org/wiki/Lake_Rotoiti_(Tasman)"
};


const map= L.map("map",{center:[stop.lat,stop.lng],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]}
);
let mrk= L.marker([stop.lat,stop.lng]).addTo(map);
mrk.bindPopup("Lake Rotoiti (Tasman)").openPopup();
//console.log(document.querySelector("#map"))