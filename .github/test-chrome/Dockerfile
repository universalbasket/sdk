FROM node:alpine

LABEL com.github.actions.name="Node with Headless Chrome"
LABEL com.github.actions.description="Alpine linux with Node and Headless Chrome"
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="green"

RUN  apk add --no-cache chromium

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
