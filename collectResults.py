#!/usr/bin/env python
# -*- coding: utf-8 -*-
# -*- coding: iso-8859-1 -*-
# -*- coding: latin-1 -*-

import urllib
import re

url = "http://www.trackandfield.se/resultat/2018/180204lgg.htm"

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)

# Write the columns
print("{")
print("  \"cols\":[")
print("    {\"id\":\"A\",\"label\":\"Gren\",\"type\":\"string\"},")
print("    {\"id\":\"B\",\"label\":\"Namn\",\"type\":\"string\"},")
print("    {\"id\":\"C\",\"label\":\"Född\",\"type\":\"string\"},")
print("    {\"id\":\"D\",\"label\":\"Resultat\",\"type\":\"string\"},")
print("    {\"id\":\"E\",\"label\":\"Klass\",\"type\":\"string\"},")
print("    {\"id\":\"F\",\"label\":\"Klubb\",\"type\":\"string\"}")
print("  ],")

# Write the rows
print("  \"rows\":[")
first = True

data = urllib.urlopen(url)

for line in data:
    line = line.strip()
    if '<th align=\'left\' colspan=\'2\'' in line:
        infostring = remove_html_tags(line)
        info = infostring.split()
        cl = info[0]
        event = infostring.replace(cl + " ", "")
    if '<td width=\'170\'' in line:
        # Relay results, FIXME later
        continue
    if '<td align=\'right\' width=\'25\'' in line:
        info = line.split("</td>")
        name = remove_html_tags(info[1])
        year = remove_html_tags(info[2])
        if int(year) > 30:
            year = "19" + year
        else:
            year = "20" + year
        club = remove_html_tags(info[3])
        result = remove_html_tags(info[4])

        # All data received, print the line
        if not first:
            print(",")
        print("    {\"c\":[")
        print("      {\"v\": \"" + event + "\"},")
        print("      {\"v\": \"" + name + "\"},")
        print("      {\"v\": \"" + year + "\"},")
        print("      {\"v\": \"" + result + "\"},")
        print("      {\"v\": \"" + cl + "\"},")
        print("      {\"v\": \"" + club + "\"}")
        print "    ]}",
        first = False
print("")
print("  ]")
print("}")
