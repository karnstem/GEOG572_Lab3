
//declare global map variables
var map;
var minValue;

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
        var cityproperties = feature.properties;
        var popupContent = " ";

        if (cityproperties.NAME){
            popupContent += "<p>City: " + cityproperties.NAME +"</p>";
        }
        if (cityproperties.ST){
            popupContent += "<p>State: " + cityproperties.ST +"</p>";
        }
        if (cityproperties.POPULATION){
            popupContent += "<p>Population: " + cityproperties.POPULATION +"</p>";
        }
        layer.bindPopup(popupContent);
        };

//Create function part 1 for proportional symbols
function calculateMinValue(response2){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var pointfeatures of response2.features){
        var popsize = pointfeatures.properties.POPULATION;
        if (popsize !== undefined && popsize !==null){
              allValues.push(popsize);
        }
    }
    //get minimum value of our array
    minValue = Math.min(...allValues)

    return minValue;
}
//Create function part 2 of proportional symbols
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

//define callback function
function callback(response2){
    //tasks using the data go here
    console.log(response2);
    //added tasks
    
    //create map element
    map = L.map('map').setView([44.06, -121.31], 8);
    //add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //calculate minimum data value
    minValue = calculateMinValue(response2);
    //call function to create proportional symbols
    createPropSymbols(response2);
    //Add circle markers for point features to the map
    function createPropSymbols(data){

        //Determine which attribute to visualize with proportional symbols
        var attribute = "POPULATION";
        //set properties of geojson marker
        
        //add geojson and popups
        L.geoJSON(data, {
            pointToLayer: function (feature,latlng) {
                var attValue = Number(feature.properties[attribute]);
                var geojsonMarkerOptions = {
                    radius: calcPropRadius(attValue),
                    fillColor: "#00ff33",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: citypopupfunction
        }).addTo(map);
    }
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

