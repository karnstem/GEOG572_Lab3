


//Load the data
function jsAjax(){
    //use Fetch to retrieve data
    fetch('USA_Major_Cities.json')
        .then(conversion) //convert data to usable form
        .then(callback) //send retrieved data to a callback function
    fetch('us_states.json')
        .then(conversion2) //convert data to usable form
        .then(callback2)
};

///// PART 1 ////////////////////////////////////////////////////////////////////////

//declare global map variables
var map;
var minValue;

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
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius /4;

    return radius;
};

//define callback function
function callback(response2){
    //tasks using the data go here
    console.log(response2);
    //added tasks
    
    //create map element
    map = L.map('map').setView([37.8, -96], 4);
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
                    fillColor: "#ae00ff",
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

////// PART 2 //////////////////////////////////////////////////////////////////

//declare global map variables
var map2;

function getColor(d) {
    return d > 1000 ? '#21231B' :
           d > 500  ? '#414635' :
           d > 200  ? '#626950' :
           d > 100  ? '#828B6A' :
           d > 50   ? '#9BA384' :
           d > 20   ? '#B3BB9D' :
           d > 10   ? '#CCD3B6' :
                      '#E4EACF';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


//define conversion callback function
function conversion2(response){
  //convert data to usable form
  return response.json();
}
function callback2(response2){
    alert("Leaflet loaded");
    //tasks using the data go here
    console.log(response2);
    //create map element
    map2 = L.map('map2').setView([37.8, -96], 4);
    //add tile layer
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2);
    
    //create geojson variable
    var geojson;

    //ASSIGN CHOROPLETH MAP CHARACTERISTICS
    //create info display variable
    var info = L.control();
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        layer.bringToFront();
        info.update(layer.feature.properties);
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
    map2.fitBounds(e.target.getBounds());
    }
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    //custom info control
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
    };

    info.addTo(map2);

    //ADD GEOJSON FEATURES TO MAP
    geojson = L.geoJson(response2, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map2);

    //LEGEND CREATION
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map2) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        //labels = ['0-10 people per square mile', '10-20 people per square mile','20-50 people per square mile','50-100 people per square mile','100-200 people per square mile','20o-500 people per square mile','500-1000 people per square mile','Over 1000 people per square mile'];
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(map2);
}
    
window.onload = jsAjax;

