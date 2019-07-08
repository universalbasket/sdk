FROM node:alpine

LABEL com.github.actions.name="Node with Headless Chrome"
LABEL com.github.actions.description="Alpine linux with Node and Headless Chrome"
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="green"

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache chromium

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
