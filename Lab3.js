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
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //add geojson
    L.geoJSON(response2, {
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
}

window.onload = jsAjax();

