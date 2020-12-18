#!/bin/sh
sudo chown -R nginx:nginx /var/www/html
sudo systemctl start nginx
