#!/bin/sh
sudo systemctl stop nginx
pm2 stop flowerstand_server
