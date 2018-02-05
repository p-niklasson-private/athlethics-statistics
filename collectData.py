#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib
import re

base_url = "http://www.friidrott.se/rs/arsbasta.aspx"
seasons  = [42,41,40,39,38,37,36,32,31,30,29,28,27,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2] # Inomhus 2018 -> Utomhus 2001
classes  = ["p14","p15","p16","p17","p19","m22","m","f14","f15","f16","f17","f19","k22","k"]

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)

f = open("data/Data.json","w")

# Write the columns
f.write("{\n")
f.write("  \"cols\":[\n")
f.write("    {\"id\":\"A\",\"label\":\"Säsong\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"B\",\"label\":\"Klass\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"C\",\"label\":\"Gren\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"D\",\"label\":\"Placering\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"E\",\"label\":\"Resultat\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"F\",\"label\":\"Namn\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"G\",\"label\":\"Född\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"H\",\"label\":\"Klubb\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"I\",\"label\":\"Plats\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"J\",\"label\":\"Datum\",\"type\":\"string\"},\n")
f.write("    {\"id\":\"K\",\"label\":\"Notering\",\"type\":\"string\"}\n")
f.write("  ],\n")

# Write the rows
f.write("  \"rows\":[\n")
first = True
for season_no in seasons:
    for cl in classes:
        target_url = base_url + "?season=" + str(season_no) + "&class=" + cl
        # print target_url
        data = urllib.urlopen(target_url)

        for line in data:
            line = line.strip()
            if '<h2>' in line or 'class="rubrik"' in line:
                season = remove_html_tags(line)
                if 'Inget årsbästa finns' in season:
                    continue
                print str(season_no) + ": " + season
            if 'colspan="4"' in line and 'img' not in line:
                if 'notis' not in line:
                    event = remove_html_tags(line)
                    place = 1
                    notis = ""
                else:
                    notis = remove_html_tags(line)
            if 'class="notis"' in line:
                if 'width="50"' in line:
                    result = remove_html_tags(line)
                if 'width="230"' in line:
                    info = remove_html_tags(line).split()
                    name = ""
                    year = ""
                    club = ""
                    for i in info:
                        if i.isdigit():
                            if int(i) > 30:
                                year = "19" + i
                            else:
                                year = "20" + i
                        elif not year:
                            name = name + i + " "
                        else:
                            club = club + i + " "
                if 'width="120"' in line:
                    city = remove_html_tags(line)
                if 'width="40"' in line:
                    date = remove_html_tags(line)
                    # All data received, print the line
                    if 'Hanviken' not in club:
                        place += 1
                        continue
                    cl = cl.upper()
                    season = season.replace(" " + cl,"")
                    if not first:
                        f.write(",\n")
                    f.write("    {\"c\":[\n")
                    f.write("      {\"v\": \"" + season + "\"},\n")
                    f.write("      {\"v\": \"" + cl + "\"},\n")
                    f.write("      {\"v\": \"" + event + "\"},\n")
                    f.write("      {\"v\": \"" + str(place) + "\"},\n")
                    f.write("      {\"v\": \"" + result + "\"},\n")
                    f.write("      {\"v\": \"" + name + "\"},\n")
                    f.write("      {\"v\": \"" + year + "\"},\n")
                    f.write("      {\"v\": \"" + club + "\"},\n")
                    f.write("      {\"v\": \"" + city + "\"},\n")   
                    f.write("      {\"v\": \"" + date + "\"},\n")
                    f.write("      {\"v\": \"" + notis + "\"}\n")
                    f.write("    ]}")
                    first = False
                    place += 1
f.write("\n")
f.write("  ]\n")
f.write("}\n")
f.close()