let earthquake = L.layerGroup();

let greyscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let myMap = L.map("map", {
    center: [37.7749, -100.4194],
    zoom: 4.5,
    layers: [greyscale, earthquake]
  });

let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(geoData).then(data => {
  console.log(data);

  function createMarker(magnitude) {
    return magnitude * 5; 
  }

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
      onEachFeature: function (feature, layers) {
        layers.bindPopup('<h2>Magnitude: ' + feature.properties.mag + '</h2><hr><h3>Location: '+ feature.properties.place + '</h3><hr><h4>Date: '
        + new Date(feature.properties.time) + '</h4>');
      }

    }).addTo(earthquake);
    earthquake.addTo(myMap);

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
      div = L.DomUtil.create('div', 'info legend'),
      depth = [-10, 10, 30, 50, 70, 90];
      labels = [];
      legendHead = "<h3 style='text-align: center'>Earthquake Depth</h3>"

      div.innerHTML = legendHead

    for (let i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + createColor(depth[i] + 1) + '"> <span>' + depth[i] + 
      (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;

    };
    legend.addTo(myMap);

});