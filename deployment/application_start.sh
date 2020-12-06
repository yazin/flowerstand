#!/bin/sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
sudo chown -R ec2-user:ec2-user $HOME/flowerstand
sudo chown -R nginx:nginx /var/www/html
pm2 start flowerstand_server
sudo systemctl start nginx
