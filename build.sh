# redis install
apt update
apt full-upgrade
apt --yes --force-yes install build-essential tcl
mkdir tmp_redis
cd tmp_redis
curl -O http://download.redis.io/redis-stable.tar.gz
cd redis-stable
make
make test
sudo make install
cd ../
# redis service setup
mkdir /etc/redis
mkdir /var/redis
cp redis_init_script /etc/init.d/redis_6379
cp redis.conf /etc/redis/6379.conf
mkdir /var/redis/6379
update-rc.d redis_6379 defaults
/etc/init.d/redis_6379 start
# install npm, node
apt-get --yes --force-yes install npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs
npm install
# host app
nodejs index.js &&
