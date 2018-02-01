hub_pw=$1
redis-server --daemonize yes
# host app
nodejs index.js $hub_pw
