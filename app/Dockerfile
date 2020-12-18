FROM node:12.19.0

WORKDIR /app

RUN apt-get update && \
    apt-get install -y tzdata && \
    apt-get clean

ENV TZ=Asia/Tokyo
