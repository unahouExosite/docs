#!/bin/bash
echo "-- get service docs --"

# check environment variable
: ${PEGASUSAPI?"Need to set env var PEGASUSAPI to e.g. pegasus-api-dev.hosted.exosite.io or localhost:8080"}

if cd murano/services; then
    rm ./*
else
    echo "Could not change directory! Aborting." 1>&2
    exit 1
fi

wget --no-verbose http://${PEGASUSAPI}/api/v1/service/doc.md -O README.md || exit 1 
 
while read line; do
    if [[ $line =~ \.\/([a-z0-9]+)\.md ]]; then
        echo "Getting doc for Service: ${BASH_REMATCH[1]}"
        wget --no-verbose http://${PEGASUSAPI}/api/v1/service/${BASH_REMATCH[1]}/doc.md -O ${BASH_REMATCH[1]}.md || exit 1
    fi
done <README.md
