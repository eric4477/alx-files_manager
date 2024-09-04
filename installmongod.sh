#!/usr/bin/bash
# Install MongoDB on CentOS 7
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
  -y --dearmor
sudo apt-get update
sudo apt-get install -y mongodb-org
systemctl start mongod