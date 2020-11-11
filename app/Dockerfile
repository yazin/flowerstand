FROM node:15.1.0

WORKDIR /app

RUN apt-get update && \
    apt-get install -y tzdata && \
    apt-get clean

ENV TZ=Asia/Tokyo
