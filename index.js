
// +++++++++++++++++++++++++ Pano +++++++++++++++++++++++++++++
// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source.
var source = Marzipano.ImageUrlSource.fromString(
  "image360/R0010114_20180720134109.JPG"
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

scene.hotspotContainer().createHotspot(document.querySelector("#hintspot"), { yaw: -1.7566494770343262, pitch: 0.4742378493648438 });

$('#hintspot').click(function(){
  changeScene("R0010115_20180720134304");
})

scene.hotspotContainer().createHotspot(document.querySelector("#textInfo"), { yaw: -0.20071556088468512 , pitch: 0.16438330695956438 });


// 14.079212, 100.613819 (AIT location)
// +++++++++++++++++++++++++ Map +++++++++++++++++++++++++++++
var map = L.map('mapid').setView([13.788669, 100.546545], 20);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 20,
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

var currentMarker = L.icon({
  iconUrl: 'img/map_mark_direction.png',
  iconSize: [50, 50],
  iconAnchor: [25, 27],
});
var current_point = L.marker([13.788683, 100.546601],{
  rotationAngle: 298.5,
  icon: currentMarker
}).addTo(map);

function onEachFeature(feature, layer){
  layer.on({
    click: whenClicked
  });
}

var headingGlobalValue = 298.5;

function whenClicked(e){
  var props = e.sourceTarget.feature.properties;

  changeScene(props.name);
}

// +++++++++++++++++++++++++ End Map +++++++++++++++++++++++++++++

function changeScene(currentScene){
  for (let index = 0; index < pointImages.length; index++) {
    const element = pointImages[index];
    if (element.properties.name == currentScene ) {
      console.log(element.properties);
      headingGlobalValue = element.properties.heading;
      var source = Marzipano.ImageUrlSource.fromString(element.properties.path);
      var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
      });

      current_point.setLatLng( new L.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0]) );
      
      scene.switchTo();

      for (let index = 0; index < element.properties.listObj.length; index++) {
        const obj = element.properties.listObj[index];
        scene.hotspotContainer().createHotspot(createHotspotOn360(obj.next, obj.type), { yaw: obj.yaw, pitch: obj.pitch });
      }
    }
  }
}

function createHotspotOn360(data, type){

  var element = document.createElement("div");
  if (type == "move") {
    var tagA = element.appendChild(document.createElement("a"));
    tagA.onclick = function () { changeScene(data); };
    var icon = tagA.appendChild(document.createElement("img"));
    icon.src = "img/hotspot_perspective.png";
  }
  
  return element
}


window.setInterval(function(){
  var imageHeading = (view._yaw*180)/Math.PI;
  var realHeading = imageHeading + headingGlobalValue;
  current_point.setRotationAngle(realHeading); 
}, 100);

$('#pano').mouseup(function(){
  $('#heading-value').text(view._yaw + " :: " + view._pitch);
})