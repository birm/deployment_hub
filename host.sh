hub_pw=$1
redis-server --daemonize yes
# host app
node index.js $hub_pw
