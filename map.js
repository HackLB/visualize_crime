mapboxgl.accessToken = 'pk.eyJ1Ijoicm9nZXJob3dhcmQiLCJhIjoiY2lrOXlnZHFvMGc5ZnY0a3ViMHkyYTE0dyJ9.CWAOOChPtxviw8fVB0R1mQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-118.1478038, 33.7960355],
    zoom: 11
});

var crimes;
var dates = [];

function displayCrimesOn(day) {
    console.log('day: ', day)

    var filters = ['==', 'day', day];
    map.setFilter('earthquake-circles', filters);
    map.setFilter('earthquake-labels', filters);

    // Set the label to the month
    document.getElementById('day').textContent = day;
}

map.on('load', function() {

    // Data courtesy of http://earthquake.usgs.gov/
    // Query for significant earthquakes in 2015 URL request looked like this:
    // http://earthquake.usgs.gov/fdsnws/event/1/query
    //    ?format=geojson
    //    &starttime=2015-01-01
    //    &endtime=2015-12-31
    //    &minmagnitude=6'
    //
    // Here we're using d3 to help us make the ajax request but you can use
    // Any request method (library or otherwise) you wish.
    d3.json('data.geojson', function(err, data) {
        if (err) throw err;

        // Create a month property value based on time
        // used to filter against.

        data.features = data.features.map(function(d) {
            d.properties.icon = 'monument';
            return d;
        });

        crimes = data;
        dates = crimes.metadata.days;

        $('#slider').attr({
           "max" : dates.length,
           "min" : 0
        });
    

        map.addSource('earthquakes', {
            'type': 'geojson',
            'data': crimes
        });

        map.addLayer({
            'id': 'earthquake-circles',
            'type': 'symbol',
            'source': 'earthquakes',
        });

        map.addLayer({
            'id': 'earthquake-labels',
            'type': 'symbol',
            'source': 'earthquakes',
            'layout': {
                'text-field': '{title}',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 8
            },
            'paint': {
                'text-color': 'rgba(255,0,0,0.5)'
            }
        });

        // // Set filter to first month of the year
        // // 0 = January
        displayCrimesOn(dates[0]);

        document.getElementById('slider').addEventListener('input', function(e) {
            // console.log(e.target.value);
            var crime_date = parseInt(e.target.value, 10);
            displayCrimesOn(dates[crime_date]);
        });
    });
});