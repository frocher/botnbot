FROM debian:buster-slim

# curl
RUN \
apt-get update && \
apt-get install -y sudo gnupg curl xz-utils git

# node
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
sudo apt-get install -y nodejs

# Copy app
ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME

# build app
RUN npm install
RUN npm run build:prod

# clean
RUN apt-get purge -y curl git gnupg

EXPOSE 8081
CMD ["npm", "run", "serve"]
