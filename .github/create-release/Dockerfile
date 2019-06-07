FROM alpine:3.9

LABEL "com.github.actions.name"="Create Release"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="black"

RUN apk add --no-cache curl
RUN apk add --no-cache jq
RUN apk add --no-cache sed
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
