const express = require('express');
const router = express.Router();
const {launchBrowser, setPageViewport} = require('./util');
const { harFromMessages } = require('chrome-har');

router.get('/', async (req, res) => {
  let browser = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    setPageViewport(page, req);

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

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);
  }
  catch (e) {
    console.error(e);
    res.status(500).send({error: 'Could not generate har'});
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
