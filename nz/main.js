console.log("Hello World");
console.log(L);
let stop = {
    nr: 17,
    name: "Lake Rotoiti",
    lat: -41.8245,
    lng: 172.8381,
    user: "AnnaKeuschnigg",
    wikipedia: "https://en.wikipedia.org/wiki/Lake_Rotoiti_(Tasman)"
};

const map = L.map("map", { //center:[stop.lat,stop.lng],
    //zoom: 12,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let nav = document.querySelector("#navigation");
console.log(nav);

//console.log(ROUTE);
ROUTE.sort((stop1, stop2) => {
    return stop1.nr > stop2.nr
});

for (let entry of ROUTE) { //console.log(entry);

    nav.innerHTML +=
        `<option value= "${entry.user}">Stop${entry.nr}: ${entry.name}</option>`;

    let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
    mrk.bindPopup(`<h4>Stop ${entry.nr}: ${entry.name}<h4>
    <p><a href="${entry.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
    `);
    if (entry.nr == 17) {
        map.setView([entry.lat, entry.lng], 13),
            mrk.openPopup();
    }
}

nav.onchange = (evt) => {
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let value = options[selected].value;
    let link = `https://${value}.github.io/nz/index.html`;
    console.log(value, link);

    window.location.href = link;
};


//console.log(document.querySelector("#map"))
//<option value= "webmapping"></option>