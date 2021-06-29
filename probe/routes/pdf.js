const express = require('express');
const router = express.Router();
const {launchBrowser} = require('./util');

router.get('/', async (req, res) => {
  let browser = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    const landscape = req.query.orientation === 'landscape';
    const format = req.query.format || 'A4';
    const emulateScreen = req.query.media === 'screen';
    const background = req.query.background === 'true';
    if (emulateScreen) {
      await page.emulateMediaType('screen');
    }
    await page.goto(req.query.url, {timeout: 60000});
    const pdf = await page.pdf({
      printBackground: background,
      landscape: landscape,
      format: format,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(pdf);
  }
  catch (e) {
    console.error(e);
    res.status(500).send({error: 'Could not generate pdf'});
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
