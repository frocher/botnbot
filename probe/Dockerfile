FROM debian:bullseye-slim

### Install utilites
RUN apt-get update --fix-missing && apt-get -y upgrade &&\
apt-get install -y sudo curl wget gnupg\
&& apt-get clean && rm -rf /var/lib/apt/lists/*

### Install node
RUN curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# chrome
RUN apt-get install -y chromium

# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome && chown -R chrome:chrome /home/chrome

# Copy app
ENV APP_HOME /home/chrome/bnb_probe
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME

# Build app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install

# Run Chrome non-privileged
USER chrome
ENV CHROME_PATH /usr/bin/chromium

EXPOSE 3000
CMD ["npm", "start"]
