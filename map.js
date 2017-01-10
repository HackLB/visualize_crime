mapboxgl.accessToken = 'pk.eyJ1Ijoicm9nZXJob3dhcmQiLCJhIjoiY2lrOXlnZHFvMGc5ZnY0a3ViMHkyYTE0dyJ9.CWAOOChPtxviw8fVB0R1mQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/basic-v9',
    center: [-118.1478038, 33.7960355],
    zoom: 11
});

var crimes;
var dates = [];

function displayCrimesOn(day) {
    // Display all crimes on the given day
    var filters = ['==', 'day', day];
    map.setFilter('crime-values', filters);
    map.setFilter('crime-labels', filters);
    updateLabel(day);
}

function updateLabel(day) {
    // Set the label to the month
    document.getElementById('day').textContent = day;
}

map.on('load', function() {

    // Load geojson and handle it
    d3.json('data.geojson', function(err, data) {
        if (err) throw err;

        // Add icon type to every feature
        data.features = data.features.map(function(d) {
            d.properties.icon = 'monument';
            return d;
        });

        // Sets global variable 
        dates = data.metadata.days;

        // Update slider to match dates ranges
        $('#slider').attr({
           "max" : dates.length,
           "min" : 0
        });
    

        // Create crimes data source
        map.addSource('crimes', {
            'type': 'geojson',
            'data': data
        });

        // Create marker layer
        map.addLayer({
            'id': 'crime-values',
            'type': 'symbol',
            'source': 'crimes',
            'layout': {
                'icon-image': 'police-15',
                'icon-allow-overlap': true
            }
        });

        // Create label layer
        map.addLayer({
            'id': 'crime-labels',
            'type': 'symbol',
            'source': 'crimes',
            'layout': {
                'text-field': '  {title}',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 10,
                'text-justify': 'left',
                'text-anchor': 'left',
                'text-offset': [1, 0]
            },
            'paint': {
                'text-color': 'rgba(255,0,0,0.5)'
            }
        });

        // Initially, display crimes from the first date in the array
        displayCrimesOn(dates[0]);

        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point);
            // document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
            var feature_properties = features.map(function(x){
                return x.properties;
            });

            console.log(feature_properties);
        });

        // When the live slider input event is fired,
        // update the slider display label to show the highlighted date  
        document.getElementById('slider').addEventListener('input', function(e) {
            var crime_date = parseInt(e.target.value, 10);
            updateLabel(dates[crime_date]);
        });

        // When the final date slider change event is fired,
        // filter crimes on the map to the selected date and update the label
        document.getElementById('slider').addEventListener('change', function(e) {
            var crime_date = parseInt(e.target.value, 10);
            displayCrimesOn(dates[crime_date]);
        });
    });
});