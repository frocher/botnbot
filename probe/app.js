require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const index = require('./routes/index');
const har = require('./routes/har');
const lighthouse = require('./routes/lighthouse');
const uptime = require('./routes/uptime');
const screenshot = require('./routes/screenshot');
const carbon = require('./routes/carbon');

const app = express();

app.use(compression());
app.use(logger('dev'));

app.use(function (req, res, next) {
  if (process.env.PROBE_TOKEN && process.env.PROBE_TOKEN !== req.query.token) {
    res.status(403).send({ error: 'Invalid token' });
  }
  else {
    next();
  }
});

app.use('/', index);
app.use('/har', har);
app.use('/lighthouse', lighthouse);
app.use('/uptime', uptime);
app.use('/screenshot', screenshot);
app.use('/carbon', carbon);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ error: 'Not found' });
  next();
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ error: 'Oops, something went wrong' });
});

module.exports = app;
