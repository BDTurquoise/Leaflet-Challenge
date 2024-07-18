// Initialize the map
let myMap = L.map("map", {
  center: [39.47, -97.603],
  zoom: 5,
});

// Adding the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Define the link to the GeoJSON data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
  if (depth > 90) return "#ea2c2c";
  else if (depth > 70) return "#ea822c";
  else if (depth > 50) return "#ee9c00";
  else if (depth > 30) return "#eecc00";
  else if (depth > 10) return "#d4ee00";
  else return "#98ee00";
}

// Fetch the GeoJSON data
d3.json(link).then(function(data) {
  // Create a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Use pointToLayer to create circle markers
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Use style to style the markers
    style: function(feature) {
      return {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    },
    // Use onEachFeature to add popups
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        `<h3>${feature.properties.place}</h3>
        <hr>
        <p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
        <p><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km</p>
        <p><strong>Time:</strong> ${new Date(feature.properties.time)}</p>`
      );
    }
  }).addTo(myMap);

  // Create a legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
      depths = [0, 10, 30, 50, 70, 90],
      labels = [];

    div.innerHTML += "<h4>Depth (km)</h4>";

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        markerColor(depths[i] + 1) +
        '"></i> ' +
        depths[i] +
        (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(myMap);
});
