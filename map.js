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
    var filters = ['==', 'day', day];
    map.setFilter('crime-circles', filters);
    updateLabel(day);
}

function updateLabel(day) {
    // Set the label to the month
    document.getElementById('day').textContent = day;
}

map.on('load', function() {

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
           "max" : dates.length - 1,
           "value" : dates.length - 1,
           "min" : 0
        });
    

        // Create crimes data source
        map.addSource('crimes', {
            'type': 'geojson',
            'data': data
        });


        map.addLayer({
            'id': 'crime-circles',
            'type': 'circle',
            'source': 'crimes',
            'paint': {
                'circle-color': {
                    property: 'magnitude',
                    stops: [
                        [0.0, '#FCA107'],
                        [1.0, '#770000']
                    ]
                },
                'circle-opacity': 0.6,
                'circle-radius': {
                    property: 'magnitude',
                    stops: [
                        [0.0, 7],
                        [1.0, 30]
                    ]
                }
            }
        });


        // Initially, display crimes from the first date in the array
        displayCrimesOn(dates[dates.length-2]);

        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['crime-circles'] });
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            if (!features.length) {
                popup.remove();
                return;
            }

            var feature = features[0];

            var popupText = '<strong>' + feature.properties.title + '</strong><br>';
            popupText += '<small>' + feature.properties.datetime + '</small><br>';
            popupText += '' + feature.properties.address + '';

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(feature.geometry.coordinates)
                .setHTML(popupText)
                .addTo(map);
        });


        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
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