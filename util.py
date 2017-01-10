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

    if 'UNREASONABLE NOISE' in crime:
        magnitude = 0.3

    if 'PETTY THEFT' in crime or 'VANDALISM' in crime:
        magnitude = 0.4

    if 'ROBBERY; COMMERCIAL' in crime or 'GRAND THEFT' in crime or 'FRAUD' in crime or 'HIT AND RUN WITHOUT INJURY' in crime or 'UNAUTHORIZED USE' in crime:
        magnitude = 0.6

    if 'ROBBERY; PERSON' in crime or 'BURGLARY' in crime or 'HIT AND RUN WITH INJURY' in crime:
        magnitude = 0.7

    if 'ASSAULT' in crime or 'BATTERY' in crime or 'VIOLENCE' in crime or 'FIGHT' in crime or 'WITH FIREARM' in crime or 'INFLICT CORP INJURY' in crime or 'DEADLY WEAPON' in crime or 'DOMESTIC VIOLENCE' in crime:
        magnitude = 0.8

    if 'RAPE' in crime or 'KIDNAPPING' in crime:
        magnitude = 0.9

    if 'MURDER' in crime:
        magnitude = 1.0

    print(magnitude)

    return magnitude