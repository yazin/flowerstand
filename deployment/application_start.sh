#!/bin/sh
pm2 start flowerstand_server
sudo systemctl start nginx
