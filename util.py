#!/usr/bin/env python
import os, sys
from pprint import pprint
import simplejson as json
import requests
import random


def get_magnitude(data):
    magnitude = 0.2
    # magnitude = random.uniform(0.0, 1.0)
    pprint(data)
    crime = data['title']

    if 'PETTY THEFT' in crime or 'VANDALISM' in crime:
        magnitude = 0.4

    if 'ROBBERY; COMMERCIAL' in crime or 'GRAND THEFT' in crime or 'FRAUD' in crime:
        magnitude = 0.6

    if 'ROBBERY; PERSON' in crime or 'BURGLARY' in crime:
        magnitude = 0.7

    if 'ASSAULT' in crime or 'BATTERY' in crime or 'VIOLENCE' in crime:
        magnitude = 0.8

    if 'RAPE' in crime:
        magnitude = 0.9

    print(magnitude)

    return magnitude