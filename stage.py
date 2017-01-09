#!/usr/bin/env python
import os, sys
from pprint import pprint
import simplejson as json
import requests


if __name__ == "__main__":
    repo_path = os.path.dirname(os.path.realpath(sys.argv[0]))
    source_path = os.path.join(os.path.dirname(repo_path), 'crime-statistics', '_data')
    data_path = os.path.join(repo_path, 'data.json')
    # os.makedirs(data_path, exist_ok=True)

    print(source_path, data_path)

    data = {}

    for directory, directories, files in os.walk(source_path, topdown=False):
        for name in files:
            if name.endswith('.json'):
                path = os.path.join(directory, name)
                # print(path)

                with open(path) as f:
                    raw_record = json.load(f)


            #                     {
            #     "block_address": "200 Block E ARTESIA BLVD",
            #     "case_number": 170000192,
            #     "city": "Long Beach",
            #     "date_occured": "2017-01-02 05:17:00 UTC",
            #     "description": "\n      \n    ",
            #     "id": 3342286,
            #     "incident_id": 100,
            #     "latitude": 33.8740741,
            #     "longitude": -118.2003385,
            #     "state": "CA",
            #     "title": "BURGLARY - RESIDENTIAL"
            # }⏎                                                                                                                                                                                                               ~/r

                record = {}
                record['title'] = raw_record.get('title')
                record['address'] = raw_record.get('block_address')
                record['datetime'] = raw_record.get('date_occured')
                record['description'] = str(raw_record.get('description', " ")).strip()
                record['latitude'] = raw_record.get('latitude')
                record['longitude'] = raw_record.get('longitude')

                date_key = record['datetime'][0:10]

                date_records = data.get(date_key, [])
                date_records.append(record)
                data[date_key] = date_records


    with open(data_path, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False, sort_keys=True)

    pprint(data)