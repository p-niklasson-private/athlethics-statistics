#!/usr/bin/bash
cp /www/git/development/athletics-stats/data/Data.json /www/git/development/athletics-stats/data/Data.json
git pull
cache-purge hanviken.niklassons.net
cache-purge hanviken-dev.niklassons.net
