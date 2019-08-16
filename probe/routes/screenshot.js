const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');


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
