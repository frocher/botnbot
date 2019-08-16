const fallback = require('express-history-api-fallback');
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const root = `${__dirname}/dist`
const apiPath = process.env.API || 'http://localhost:3000/';

app.use(express.static(root));
app.use('/api', proxy(apiPath));
app.use('/omniauth', proxy(apiPath + 'omniauth/'));
app.use(fallback('index.html', { root: root }));

app.listen(8081);
