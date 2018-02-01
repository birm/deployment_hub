FROM redis
# build the container

WORKDIR "/app"

COPY package*.json ./
COPY . .

# install npm, node
RUN apt-get update
RUN apt-get install curl sudo --yes --force-yes

RUN curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN apt-get --yes --force-yes install npm

RUN npm install
# host app
ENTRYPOINT bash /app/host.sh $hub_pw
