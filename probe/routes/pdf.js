const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');


router.get('/', function (req, res, next) {
  const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
  puppeteer.launch({executablePath: chromePath}).then(async browser => {
    const page = await browser.newPage();
    const landscape = req.query.orientation === 'landscape';
    const format = req.query.format || 'A4';
    const emulateScreen = req.query.media === 'screen';
    const background = req.query.background === 'true';
    if (emulateScreen) {
      await page.emulateMediaType('screen');
    }
    await page.goto(req.query.url, {timeout: 60000});
    const shot = await page.pdf({
      printBackground: background,
      landscape: landscape,
      format: format,
    });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(shot);
  }).catch(e => {
    console.error(e);
    res.status(500).send({error: 'Could not generate pdf'});
  });
});

module.exports = router;
