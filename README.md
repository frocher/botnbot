<p align="center"><img src="https://my.botnbot.com/images/icon-128x128.png" alt="Botnbot logo" width="128" height="128">
</p>

# Welcome to Botnbot 

> Botnbot is an uptime and front-end performance monitoring tool.


The Botnbot application is divided in 3 components :
* [The front end](frontend/README.md) : the Single Page Application written with [LitElement](https://lit.dev/) webcomponents.
* [The backend](backend/README.md) : the API and the core of the application.
* [The probes](probe/README.md) : you can use as many probes as you want to measure your pages performance.

## Quickstart guide

For an easy quickstart, you must have Docker and [docker-compose](https://docs.docker.com/compose/) installed on your computer.

To start the application for the first time you just have to enter these 3 lines in your terminal :
```sh
docker-compose build
docker-compose run api rake db:migrate
docker-compose up
```

Once launched, you can create a new account:
1. Enter the url http://localhost:8080 in your browser.
2. Click the [signup](http://localhost:8080/signup) link.
3. Enter your account informations and click the "SIGN ME UP" button.
4. Enter the url http://localhost:8082 in your browser to open the maildev web client, and follow the instructions of the signup mail.
5. You can now sign in the application with your new account. 

### Environment variables

Each component uses environment variables for configuration. Default values are defined directly in the *docker-compose.yml* file. You can replace them with your own values by creating a [env](https://docs.docker.com/compose/env-file/) in the directory where the *docker-compose* command is executed.


## License

This project is [Apache License 2.0](https://github.com/frocher/botnbot/blob/master/LICENSE) licensed.
