# Botnbot

## Summary

Botnbot is an uptime and front-end performance monitoring tool.
For more information about its features, visite [https://www.botnbot.com](https://www.botnbot.com).

The Botnbot application contains 3 components :
* [The front end](frontend/README.md) : the Single Page Application written with [Polymer](https://www.polymer-project.org/) components.
* [The backend](backend/README.md) : the API and the core of the application.
* [The probes](probe/README.md) : you can use as many probes as you want to measure your pages performance.

## Quickstart guide

For an easy quickstart, you must have Docker and docker-compose installed on your computer.

```sh
docker-compose build
docker-compose run api rake db:migrate
docker-compose up
```
You can then open your browser and enter the url : http://localhost:8080 to run the application.
