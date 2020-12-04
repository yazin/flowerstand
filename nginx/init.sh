#!/bin/sh

mkdir -p /var/www
cp -R /tmp/html /var/www
chown -R nginx:nginx /var/www/html

nginx -g "daemon off;"
