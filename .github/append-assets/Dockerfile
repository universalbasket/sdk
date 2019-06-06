FROM alpine:3.9

LABEL "com.github.actions.name"="Append Assets"
LABEL "com.github.actions.icon"="send"
LABEL "com.github.actions.color"="blue"

RUN apk add --no-cache curl
RUN apk add --no-cache jq
RUN apk add --no-cache sed
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
