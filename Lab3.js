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
        fillColor: "#00ff33",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //add geojson and popups
    L.geoJSON(response2, {
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: citypopupfunction
    }).addTo(map);
    //add popup about lat long

    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    map.on('click', onMapClick);
}

window.onload = jsAjax();

