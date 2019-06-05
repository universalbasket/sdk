#!/bin/sh

echo "Creating release for $GITHUB_REF."

# Trim leading refs/tags/ and assign to TAG_NAME.

TAG_NAME=${GITHUB_REF:10}
DATA="{\"tag_name\":\"$TAG_NAME\"}"

echo $DATA

URL=https://api.github.com/repos/$GITHUB_REPOSITORY/releases

echo $URL

status=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -d $DATA $URL?access_token=$GITHUB_TOKEN)

echo "status was: $status"

if [ "$status" -ne "201" ]; then
    >&2 echo "Error, got status $status."
    exit 1
fi
