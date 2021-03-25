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


const map= L.map("map",{//center:[stop.lat,stop.lng],
    //zoom: 12,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]}
);

console.log(ROUTE);
for(let entry of ROUTE) {
    console.log(entry);
    let mrk = L.marker([ stop.lat, stop.lng ]).addTo(map);
    mrk.bindPopup(`<h4>Stop ${stop.nr}: ${stop.name}<h4>
    <p><a href="${stop.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
    `);
    if (entry.nr==17) {
        map.setView([entry.lat, entry.lng], 13);
        mrk.openPopup();
}


//console.log(document.querySelector("#map")