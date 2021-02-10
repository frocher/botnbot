# The BotnBot Backend

The BotnBot Backend is the central point of the BotnBot application. It is a Rails API only software used by the [BotnBot frontend application](../frontend/README.md).

## Before starting : the dependencies

You'll need the following software to make the backend run on your system:

* Node.js
* Ruby >= 2.3
* [InfluxDB](https://influxdata.com/time-series-platform/influxdb/)
* [MySQL](https://www.mysql.com)
* a SMTP server
* [one or more BotnBot probes](../probe/README.md)

## Quickstart for development

The backend relies on [dotenv](https://github.com/bkeepers/dotenv) for environment variables. You must start by creating a *.env* file in your directory. You can find a *.env.sample* in the *root* directory to copy and adapt.

With Ruby installed, run the following lines from the root of your project download:

You first need to create the MySQL database:
```sh
mysql -u root -e "create database botnbot"
```

Then create the database schema:
```sh
bundle install
rake db:migrate
```

You also need to create the InfluxDB database:
```sh
influx -execute 'create database botnbot'
```

The backend sends mails. You need to catch them with mailcatcher:
```sh
gem install mailcatcher -- --with-cflags="-Wno-error=implicit-function-declaration"
```

And you are finally ready to start the API server:
```sh
rails s
```


## Configuration

The backend uses the following environment variables.

This software uses the [Figaro gem](https://github.com/laserlemon/figaro). You can define this variables using an application.yml file or using environment variables.
An application.yml.sample file is included in the config directory.

### Mandatory configuration

| Name  | Default Value | Description  |
| ----- | ------------- | ------------ |
| DEVISE_SECRET_KEY | none | You must generate a Devise key
| RAILS_ENV | development | Don't forget to switch it to production |
| PORT | 3000 | Puma server port |
| PROBES | '[{ "name":"localhost", "host":"localhost", "port":3333}]' | array of probes defined as a json string |
| SECRET_TOKEN | none | Rails needs a secret token |

### Mail configuration

| Name    | Default Value | Description  |
| --------|:---------:| -----|
| MAILER_SENDER | jeeves.thebot@botnbot.com | Mail sender |
| HTTP_PROTOCOL | http |  |
| HTTP_HOST | localhost |  |
| HTTP_PORT | 80 |  |
| SMTP_HOST | localhost | SMTP host |
| SMTP_PORT | 1025 | SMTP port |


### MySQL Configuration

| Name    | Default Value | Description  |
| --------|:---------:| -----|
| DB_HOST | localhost | Database host server |
| DB_NAME | botnbot | Database name |
| DB_PASSWORD | &nbsp; | User password |
| DB_PORT | 3306 | Database port |
| DB_USERNAME | root | User name used to log in |

### InfluxDB Configuration

| Name    | Default Value | Description  |
| --------|:---------:| -----|
| INFLUXDB_HOST | localhost | InfluxDB host server |
| INFLUXDB_DATABASE | botnbot | Database name |
| INFLUXDB_PASSWORD | &nbsp; | User password |
| INFLUXDB_PORT | 8083 | InfluxDB port |
| INFLUXDB_USERNAME | root | User name used to log in |

### OAuth Configuration

| Name    | Default Value | Description  |
| --------|:---------:| -----|
| FACEBOOK_KEY | none | facebook key for omniauth |
| FACEBOOK_SECRET | none | facebook secret for omniauth |
| GITHUB_KEY | none | github key for omniauth |
| GITHUB_SECRET | none | github secret for omniauth |
| GOOGLE_KEY | none | google key for omniauth |
| GOOGLE_SECRET | none | google secret for omniauth |

### Push notifications Configuration

| Name    | Default Value | Description  |
| --------|:---------:| -----|
| PUSH_SUBJECT | none | vapid subject |
| PUSH_PUBLIC_KEY | none | vapid public key |
| PUSH_PRIVATE_KEY | none | vapid private key |
