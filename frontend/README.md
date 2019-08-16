# Botnbot Frontend

## Usage

### Dependencies

Botnbot Frontend depends on the [Botnbot Backend](../backend/README.md) : the API and the core of the application.
You have to start it before starting the app. 

### Quickstart

For development, you just avec to start the webpack-dev-server on localhost http://localhost:8081 with hot-reload.

```
npm run dev
```

### Building Your Application

```
$ npm run build:prod
```

This will create a build of your application in the `dist/` directory, optimized to be served in production. You can then serve the built version :

```
$ npm run serve
```

## Supported Browsers

All modern browsers that support JavaScript modules (https://caniuse.com/#feat=es6-module).

Internet Explorer is not and will not be supported.
