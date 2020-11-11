FROM node:12.19.0-alpine3.12

WORKDIR /app

RUN apk update && \
    apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone && \
    apk del tzdata

ENV TZ=Asia/Tokyo
