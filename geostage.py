#!/usr/bin/env python
import os, sys
from pprint import pprint
import simplejson as json
import requests

from util import get_magnitude


if __name__ == "__main__":
    repo_path = os.path.dirname(os.path.realpath(sys.argv[0]))
    source_path = os.path.join(os.path.dirname(repo_path), 'crime-statistics', '_data')
    data_path = os.path.join(repo_path, 'data.geojson')
    # os.makedirs(data_path, exist_ok=True)

    print(source_path, data_path)

    data = {
        "type": "FeatureCollection",
        "metadata": {
            "title": "Long Beach crimes",
            "days": [],
            "count": 0
        },
        "features": [],    
    }

    for directory, directories, files in os.walk(source_path, topdown=False):
        for name in files:
            if name.endswith('.json'):
                path = os.path.join(directory, name)

                with open(path) as f:
                    raw_record = json.load(f)


                record = {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "Point",
                    "coordinates": []
                  },
                  "id": ""
                }


                record['id'] = raw_record.get('id')

                record['properties']['title'] = raw_record.get('title')
                record['properties']['address'] = raw_record.get('block_address')
                record['properties']['datetime'] = raw_record.get('date_occured')
                record['properties']['day'] = record['properties']['datetime'][0:10]
                record['properties']['description'] = str(raw_record.get('description', " ")).strip()
                record['properties']['magnitude'] = get_magnitude(raw_record)

                record['geometry']['coordinates'] = [raw_record.get('longitude'), raw_record.get('latitude')]

                data['features'].append(record)

                if record['properties']['day'] not in data['metadata']['days']:
                    data['metadata']['days'].append(record['properties']['day'])


    data['metadata']['count'] = len(data['features'])

    with open(data_path, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False, sort_keys=True)

    # pprint(data)