ADMIN_PW = $1
# install npm, node

apt-get --yes --force-yes install npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs
npm install
# host app
nodejs index.js $ADMIN_PW &&
