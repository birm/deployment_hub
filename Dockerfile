# start with redis
FROM redis
ARG hub_pw
# build the container
RUN sudo bash build.sh $hub_pw
