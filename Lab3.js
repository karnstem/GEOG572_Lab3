//Load the data

function jsAjax(){
    //use Fetch to retrieve data
    fetch('USA_Major_Cities.json')
        .then(conversion) //convert data to usable form
        .then(callback) //send retrieved data to a callback function
};

//define conversion callback function
function conversion(response){
  //convert data to usable form
  return response.json();
}

//define callback function
function callback(response2){
    //tasks using the data go here
    console.log(response2);
    //added tasks
    //create map element
    var map = L.map('map').setView([44.06, -121.31], 8);
    //add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //set properties of geojson marker
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff00e6",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //define popup function
    function citypopupfunction(feature,layer){
        var popupContent = "";
        if (feature.properties) {
            //loop to add feature property names and values to html string
            for (var property in feature.properties){
                popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
            }
            layer.bindPopup(popupContent);
        };
    };
    
    //add geojson
    L.geoJSON(response2, {
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        onEachFeature: Citypopupfunction;
        },
    }).addTo(map);
    //add popup about lat long
    function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }
    map.on('click', onMapClick);

    //add popup to each feature
    function onEachFeature(feature, layer) {
        //no property named popupContent; instead, create html string with all properties
        var popupContent = "";
        if (feature.properties) {
            //loop to add feature property names and values to html string
            for (var property in feature.properties){
                popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
            }
            layer.bindPopup(popupContent);
        };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature
            }).addTo(map);
        })  
};
}

window.onload = jsAjax();

