const express = require('express');
const {launchBrowser, setPageViewport} = require('./util');
const router = express.Router();

router.get('/', async (req, res) => {
  let browser = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    setPageViewport(page, req);
    await page.goto(req.query.url, {timeout: 60000});
    const shot = await page.screenshot({});
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(shot);
  }
  catch (e) {
    console.error(e);
    res.status(500).send({error: 'Could not take screenshot'});
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
