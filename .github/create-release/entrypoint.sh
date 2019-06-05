#!/bin/sh

echo "Creating release for $GITHUB_REF."

# Trim leading refs/tags/ and assign to TAG_NAME.

TAG_NAME=${GITHUB_REF:10}
DATA='{"name": "$TAG_NAME", "tag_name": "$TAG_NAME"}'

echo $DATA

URL=https://api.github.com/repos/$GITHUB_REPOSITORY/releases?access_token=$GITHUB_TOKEN

status=$(curl -k -s -o /dev/null -w "%{http_code}" --data $DATA $URL)

if [ "$status" -ge 300 ]; then
    >&2 echo "Error, got status $status."
    exit 1
fi
