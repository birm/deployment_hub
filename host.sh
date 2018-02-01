hub_pw=$1
redis-server --daemonize yes
# host app
redis-cli set ADMIN_PW  $hub_pw
node index.js $hub_pw
