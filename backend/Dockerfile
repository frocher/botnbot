FROM debian:stretch-slim

ENV DEBIAN_FRONTEND noninteractive
ENV INITRD No

### Build package
RUN set -ex; \
	apt-get update; \
	apt-get install -y \
    git-core \
    ca-certificates \
    curl \
    sudo \
    zlib1g-dev \
    build-essential \
    libssl-dev \
    libreadline-dev \
    libmariadbclient-dev \
    mysql-client \
    libyaml-dev \
    libsqlite3-dev \
    libxml2-dev \
    libxslt1-dev \
    libcurl4-openssl-dev \
    libfontconfig1 \
    libfontconfig1-dev \
    libicu-dev \
    libfreetype6 \
    libfreetype6-dev \
    libssl-dev \
    libxft-dev \
    libpng-dev \
    libjpeg-dev \
    software-properties-common \
    libffi-dev

### Install rbenv
RUN git clone https://github.com/sstephenson/rbenv.git /usr/local/rbenv
RUN echo '# rbenv setup' > /etc/profile.d/rbenv.sh
RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >> /etc/profile.d/rbenv.sh
RUN echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >> /etc/profile.d/rbenv.sh
RUN echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh
RUN chmod +x /etc/profile.d/rbenv.sh

# install ruby-build
RUN mkdir /usr/local/rbenv/plugins
RUN git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build

ENV RBENV_ROOT /usr/local/rbenv
ENV PATH $RBENV_ROOT/bin:$RBENV_ROOT/shims:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN rbenv install -v 2.7.0
RUN rbenv global 2.7.0

RUN ruby -v
RUN echo "gem: --no-document" > ~/.gemrc
RUN gem install bundler

### Install node
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# for paperclip image manipulation
RUN apt-get install -y file imagemagick

# for nokogiri
RUN apt-get install -y libxml2-dev libxslt1-dev

ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN gem install bundler
RUN bundle install --without test
RUN rbenv rehash

# All app
COPY . $APP_HOME

EXPOSE 3000
CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0"]
