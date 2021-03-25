console.log("Hello World");
console.log(L);

const map= L.map("map",{center:[-41.8245, 172.8381],
    zoom: 13,
    layers: [
        L.titelLayer("https://{s}.titel.openstreetmap.org/{z}/{x}/{y}.png")
    ]}
);
console.log(document.querySelector("#map"))