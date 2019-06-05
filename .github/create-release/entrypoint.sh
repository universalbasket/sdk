#!/bin/sh

echo "Creating release for $GITHUB_REF."

# Trim leading refs/tags/ and assign to TAG_NAME.

TAG_NAME=${$GITHUB_REF:10}

curl --data '{"name": "$TAGNAME", "tag": "$TAGNAME"}' https://api.github.com/repos/$GITHUB_REPOSITORY/releases?access_token=$GITHUB_TOKEN
