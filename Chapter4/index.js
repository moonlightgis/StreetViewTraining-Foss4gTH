// +++++++++++++++++++++++++ Pano +++++++++++++++++++++++++++++
// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source.
var source = Marzipano.ImageUrlSource.fromString(
  "image360/section1-1.jpg"
);

// Create geometry.
var geometry = new Marzipano.EquirectGeometry([{ width: 5376 }]);

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
var view = new Marzipano.RectilinearView({ yaw: Math.PI/180 }, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();




// 14.079212, 100.613819 (AIT location)
// 13.788333333333334, 100.5461111111111 (I-bitz location)
// +++++++++++++++++++++++++ Map +++++++++++++++++++++++++++++
var map = L.map('mapid').setView([13.788333333333334, 100.5461111111111], 17);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);


var geoJsonImage = L.geoJSON(pointImages, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "#ff7800",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
});
geoJsonImage.addTo(map);

function onEachFeature(feature, layer){
  layer.on({
    click: whenClicked
  });
  // var popupContent = "<p>GeoJSON Type : " + feature.geometry.type + "</p><p>Feature name : "+ feature.properties.name +"</p>";
  
  // layer.bindPopup(popupContent);
}

function whenClicked(e){
  var props = e.sourceTarget.feature.properties;

  var source = Marzipano.ImageUrlSource.fromString(
    props.path
  );
  var scene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
    pinFirstLevel: true
  });
  scene.switchTo();
}

