FROM redis
ARG hub_pw
# build the container
ADD . / ./
# install npm, node
RUN apt-get update
RUN apt-get install curl sudo --yes --force-yes
RUN apt-get --yes --force-yes install npm

RUN npm install
# host app
CMD [ "nodejs", "index.js", $hub_pw]
