## The BotnBot Probe

The Botnbot Probe is a standalone application that returns different statistics about an url.

You can request lighthouse statistics about a given url with a HTTP command like this : http://localhost:3333/lighthouse?url=https://www.github.com.
You can also request a simple uptime monitoring with something like this : http://localhost:3333/uptime?url=https://www.github.com

### Dependencies

This application is written with NodeJS and uses different tools :

* Node.js
* Google Chrome

### Quickstart (without Docker)

You'll need to install Chrome. Just look at the Dockerfile to see what to do (and good luck to you).


```sh
npm install
npm start
```

### Quickstart (the Docker way)

```sh
docker run -p 3333:3000 --cap-add=ALL
```

or if docker-compose is installed

```sh
docker-compose build
docker-compose up
```

### Configuration

the BotnBot Probe uses the following environment variables :

* PROBE_TOKEN : You can define a token to restrict access to the probe. If probe token is undefined, no access restriction is applied otherwise the token must be passed as a 'token' parameter.
* CHROME_PATH : Needed for screenshots made with puppeteer. Default is /usr/bin/google-chrome.

This software uses the dotenv module. You can define this variables using a .env file or using environment variables.

### API Documentation

#### Uptime

```
http://your_domain/uptime?url=<url>&token=<token>&keyword=<keyword>&type=<type>
```

| Param   | Mandatory | Description  |
| --------|:---------:| -----|
| url     | yes       | URL to check (e.g. http://www.google.com)|
| token   | no        | Secret token used to restrict access |
| keyword | no        | Check if a keyword is present or absent depending on the type parameter |
| type    | no        | Can be 'presence' or 'absence'. Default is 'presence' |

#### HAR

```
http://your_domain/har?url=<url>&token=<token>
```

| Param   | Mandatory | Description  |
| --------|:---------:| -----|
| url     | yes       | URL to check (e.g. http://www.google.com)|
| token   | no        | Secret token used to restrict access |
| emulation | no      | Can be 'mobile' or 'desktop'. Default is 'mobile' |

#### Lighthouse

```
http://your_domain/lighthouse?url=<url>&token=<token>
```

| Param   | Mandatory | Description  |
| --------|:---------:| -----|
| url     | yes       | URL to check (e.g. http://www.google.com)|
| token   | no        | Secret token used to restrict access |
| type    | no        | Can be 'html' or 'json'. Default is 'json' |
| emulation | no      | Can be 'mobile', 'desktop' or 'none'. Default is 'mobile' |

#### Screenshot

```
http://your_domain/screenshot?url=<url>&token=<token>
```

| Param   | Mandatory | Description  |
| --------|:---------:| -----|  
| url     | yes       | URL to check (e.g. http://www.google.com)|
| token   | no        | Secret token used to restrict access |
| emulation | no      | Can be 'mobile' or 'desktop'. Default is 'mobile' |
| width   | no        | Screenshot width in pixels. Default is 1280 for desktop and 412 for mobile |
| height  | no        | Screenshot height in pixels. Default is 960 for desktop and 732 for mobile |

#### PDF

```
http://your_domain/pdf?url=<url>&token=<token>
```

| Param   | Mandatory | Description  |
| --------|:---------:| -----|
| url     | yes       | URL to check (e.g. http://www.google.com)|
| token   | no        | Secret token used to restrict access |
| orientation | no    | Can be 'portrait' or 'landscape'. Default is 'portrait' |
| media   | no        | Can be 'print' or 'screen'. Default is 'print' |
| format  | no        | Can be 'Letter', 'Legal', 'A0' to 'A4'. Default is 'A4' |
| background | no     | Can be 'true' or 'false'. Default is 'false' |
 