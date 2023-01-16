let myMap = L.map("map", {
    center: [37.7749, -100.4194],
    zoom: 4.5
  });

// let earthquake = L.layerGroup();

let topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(geoData).then(data => {
  console.log(data);
    // let heatArray=[];

    // data.forEach(location => heatArray.push([location.features.geometry.coordinates[1],location.features.geometry.coordinates[0]]));
    
    // let heat = L.heatLayer(data, {
    //     radius:20,
    //     blur:35
    // }).addTo(myMap);

  })

  // function 
