const express = require('express');
const {launchBrowser, setPageViewport} = require('./util');
const router = express.Router();

router.get('/', function (req, res) {
  launchBrowser().then(async browser => {
    const page = await browser.newPage();
    setPageViewport(page, req);
    await page.goto(req.query.url, {timeout: 60000});
    const shot = await page.screenshot({});
    await browser.close();
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(shot);
  }).catch(e => {
    console.error(e);
    res.status(500).send({error: 'Could not take screenshot'});
  });
});

module.exports = router;
