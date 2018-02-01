FROM redis
# build the container

WORKDIR "/app"

COPY package*.json ./
COPY . .

# install npm, node
RUN apt-get update
RUN apt-get install curl sudo --yes --force-yes

RUN apt-get --yes --force-yes install npm

RUN npm install -g n

RUN n latest

RUN npm install
# host app
ENTRYPOINT bash /app/host.sh $hub_pw
