const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const { harFromMessages } = require('chrome-har');

router.get('/', function (req, res, next) {
  const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
  puppeteer.launch({executablePath: chromePath}).then(async browser => {
    const page = await browser.newPage();
    const emulation = req.query.emulation || 'mobile';
    const defaultWidth = emulation === 'mobile' ? 412 : 1280;
    const defaultHeight = emulation === 'mobile' ? 732 : 960;
    page.setViewport({
      width: req.query.width ? parseInt(req.query.width, 10) : defaultWidth,
      height: req.query.heigh ? parseInt(req.query.height, 10) : defaultHeight
    });

    // list of events for converting to HAR
    const events = [];

    // event types to observe
    const observe = [
      'Page.loadEventFired',
      'Page.domContentEventFired',
      'Page.frameStartedLoading',
      'Page.frameAttached',
      'Network.requestWillBeSent',
      'Network.requestServedFromCache',
      'Network.dataReceived',
      'Network.responseReceived',
      'Network.resourceChangedPriority',
      'Network.loadingFinished',
      'Network.loadingFailed',
    ];
    
    // register events listeners
    const client = await page.target().createCDPSession();
    await client.send('Page.enable');
    await client.send('Network.enable');
    observe.forEach(method => {
      client.on(method, params => {
        events.push({ method, params });
      });
    });

    await page.goto(req.query.url, {timeout: 60000});  
    const har = harFromMessages(events);
    const json = JSON.stringify(har, null, 4);
    await browser.close();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);
  }).catch(e => {
    console.error(e);
    res.status(500).send({error: 'Could not generate har'});
  });
});

module.exports = router;
