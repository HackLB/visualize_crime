mapboxgl.accessToken = 'pk.eyJ1Ijoicm9nZXJob3dhcmQiLCJhIjoiY2lrOXlnZHFvMGc5ZnY0a3ViMHkyYTE0dyJ9.CWAOOChPtxviw8fVB0R1mQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/basic-v9',
    center: [-118.1478038, 33.7960355],
    zoom: 11.6
});


map.on('load', function() {

    // Load geojson and handle it
    d3.json('http://0.0.0.0:8000/crime/api/incidentgeo/', function(err, data) {
        if (err) throw err;
    
        // Create crimes data source
        map.addSource('crimes', {
            'type': 'geojson',
            'data': data.results,
        });

        map.addLayer({
            'id': 'parcels-parks',
            'type': 'circle',
            'source': 'crimes',
            'paint': {
                "circle-color": {
                    property: 'magnitude',
                    stops: [
                        [0.5, '#00ff00'],
                        [1.0, '#ff0000']
                    ]
                },
                "circle-radius": 20,
                "circle-blur": 1,
                
            }
        });

    });
});