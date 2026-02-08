//Load the data

function jsAjax(){
    //use Fetch to retrieve data
    fetch('USA_Major_Cities.geojson')
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

////////////////////////////////////////////





//different types of markers, etc.
var marker = L.marker([44, -121]).addTo(map);

var circle = L.circle([44.9, -121.9], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,    radius: 500
}).addTo(map);

var polygon = L.polygon([
    [44.06, -121.31],
    [44.03, -121.35],
    [44.09, -121.39]
]).addTo(map);

//adding a popup
marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([44.06, -121.31])
    .setContent("I am a standalone popup.")
    .openOn(map);

var popup = L.popup();

//add an alert with listener function
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

//add a popup with listener function
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

/////////////////////////////////////////////////////////
L.geoJSON(geojsonFeature).addTo(map);


//////////////////////////////////////////////////////////////

//Define the two provided arrays outside the function.
var cities = ['Corvallis', 'Portland', 'Eugene', 'Albany']
var pops = ['59920', '652500', '176650', '56470']

//Instructions for when window loads
window.onload = initialize

//initialize executes and starts the citiesfunction() with the paramaters (cities,pops)
function initialize(){
    citiesfunction(cities,pops);
};

//function for constructing the table
function citiesfunction(cities,pops){

    //Base table with nothing in it yet
    var table = document.createElement("table");

    //Header row creation
    var headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    //Creation of first column (cities, displayed as "City")
    var cityHeader = document.createElement("th");
    cityHeader.innerHTML = "City";
    headerRow.appendChild(cityHeader);

    //Creation of second column (pops, displayed as "Population")
    var populationHeader = document.createElement("th");
    populationHeader.innerHTML = "Population";
    headerRow.appendChild(populationHeader);

    //Looping through the creation of each of the rows adds the data to the table
    for (var i = 0; i < cities.length; i++){
        var tr = document.createElement("tr");

        var city = document.createElement("td");
        city.innerHTML = cities[i];
        tr.appendChild(city);

        var population = document.createElement("td");
        population.innerHTML = pops[i];
        tr.appendChild(population);

        table.appendChild(tr);
    };

    //add the table to the div in index.html
    var myDiv =  document.getElementById("mydiv");
    myDiv.appendChild(table); //This means "Attach the thing that we created "table" to mydiv from the html file.
};