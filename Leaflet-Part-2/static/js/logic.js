// Creating layer groups to place on top of the maps
let earthquake = L.layerGroup();
let tecPlates = L.layerGroup();

// Creating tile layers for the map visual
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Tectonic Plates geoData
let platesgeo = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

d3.json(platesgeo).then(data2 => {
  L.geoJSON(data2, {
    color: "orange",
    weight: 6
  }).addTo(tecPlates);
  tecPlates.addTo(myMap);
});

// Creating basemaps for base layers
let baseMaps = {
  'Street': street,
  'Topo': topo,
};

// Creating overlays to hold overlay objects
let overlayMap = {
  'Earthquakes': earthquake,
  'Tectonic Plates': tecPlates
};

// Creating a map on page load
let myMap = L.map("map", {
  center: [37.7749, -100.4194],
  zoom: 4.5,
  layers: [street, tecPlates]
});

L.control.layers(baseMaps, overlayMap, {
  collapsed: false
}).addTo(myMap);

let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(geoData).then(data => {
  console.log(data);

// Creating markers and inlarging for better visual
  function createMarker(magnitude) {
    return magnitude * 5; 
  }

// Giving colors to various earthquake depths
    function createColor(depth) {
      switch(true) {
        case depth >= 90:
          return "#990000";
        case depth >= 70:
          return "#ff3300";
        case depth >= 50:
          return "#ff9900";
        case depth >= 30:
          return "#ebd600";
        case depth >= 10:
          return "#cceb0a";
        default:
          return "#33b233";

      }
    }

// Creating features that give data about the given earthquake
    L.geoJSON(data, {
      pointToLayer: function (feature, mapCoordinate) {
        return L.circleMarker(mapCoordinate, 
          {
            radius: createMarker(feature.properties.mag),
            fillColor: createColor(feature.geometry.coordinates[2]),
            fillOpacity: .8,
            color: 'black',
            weight: .5
          });
      },

// Popup
      onEachFeature: function (feature, layers) {
        layers.bindPopup('<h2>Magnitude: ' + feature.properties.mag + '</h2><hr><h3>Location: '+ feature.properties.place + '</h3><hr><h4>Date: '
        + new Date(feature.properties.time) + '</h4>');
      }

    }).addTo(earthquake);
    earthquake.addTo(myMap);

// Creating a legend and pinning it to the bottom right
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
      div = L.DomUtil.create('div', 'info legend'),
      depth = [-10, 10, 30, 50, 70, 90];
      labels = [];
      legendHead = "<h3 style='text-align: center'>Earthquake Depth</h3>"

      div.innerHTML = legendHead

// Inseting threshold into legend and styling
    for (let i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + createColor(depth[i] + 1) + '"> <span>' + depth[i] + 
      (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;

    };
    legend.addTo(myMap);

});