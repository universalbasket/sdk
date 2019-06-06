#!/bin/sh

echo "Appending assets to $GITHUB_REF."

# Trims off quotes and the trailing "{?name,label}"
URL=$(jq .upload_url < release.json | sed -e 's/"//g' -e 's/^\(.*\){.*$/\1/')

echo $URL

statusjs=$(curl -w "\n%{http_code}" --data-binary @"build.js" -H "Content-Type: octet/stream" $URL?access_token=$GITHUB_TOKEN&name=build.js | tail -n 1)

if [ "$statusjs" -ne "201" ]; then
    >&2 echo "Error, got status $statusjs when uploading build.js."
    exit 1
fi

statuscss=$(curl -w "\n%{http_code}" --data-binary @"index.css" -H "Content-Type: octet/stream" $URL?access_token=$GITHUB_TOKEN&name=index.css | tail -n 1)

if [ "$statuscss" -ne "201" ]; then
    >&2 echo "Error, got status $statuscss when uploading index.css."
    exit 1
fi
