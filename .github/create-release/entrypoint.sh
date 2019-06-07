#!/bin/sh

echo "Creating release for $GITHUB_REF."

# Trim leading refs/tags/ and assign to TAG_NAME.

TAG_NAME=${GITHUB_REF:10}
DATA="{\"tag_name\":\"$TAG_NAME\"}"

echo $DATA

URL=https://api.github.com/repos/$GITHUB_REPOSITORY/releases

echo $URL

curl -s -w "\n%{http_code}" -H "Content-Type: application/json" -d $DATA "$URL?access_token=$GITHUB_TOKEN" > output.txt

status=$(tail -n 1 < output.txt)

if [ "$status" != "201" ]; then
    >&2 echo "Error, got status $status."
    exit 1
fi

# Trims off quotes and the trailing "{?name,label}"
ASSETS_URL=$(head -n -1 < output.txt | jq .upload_url | sed -e 's/"//g' -e 's/^\(.*\){.*$/\1/')

echo "Uploading assets using $ASSETS_URL."

for name in "$@"
do
    echo "Uploading $name"
    status=$(curl -w "\n%{http_code}" --data-binary @"$name" -H "Content-Type: octet/stream" "$ASSETS_URL?access_token=$GITHUB_TOKEN&name=$name" | tail -n 1)

    if [ "$status" != "201" ]; then
        >&2 echo "Error, got status $status when uploading $name."
        exit 1
    fi
done
