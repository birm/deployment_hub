sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo cp redis_init_script /etc/init.d/redis_6379
sudo cp redis.conf /etc/redis/6379.conf
sudo mkdir /var/redis/6379
sudo update-rc.d redis_6379 defaults
sudo /etc/init.d/redis_6379 start
