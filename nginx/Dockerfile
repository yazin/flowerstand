FROM nginx:1.19.5-alpine

RUN apk update && \
    apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone && \
    apk del tzdata

ENV TZ=Asia/Tokyo

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

COPY ./init.sh /tmp

RUN chmod +x /tmp/init.sh

CMD ["/tmp/init.sh"]
