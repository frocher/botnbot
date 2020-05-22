const express = require('express');
const router = express.Router();
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator.js');

function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
  return chromeLauncher.launch({chromeFlags: ['--disable-gpu', '--headless']}).then(chrome => {
    flags.port = chrome.port;
    return lighthouse(url, flags, config).then(results =>
      chrome.kill().then(() => results));
  });
}

router.get('/', function (req, res, next) {
  const flags = {};
  flags.emulatedFormFactor = req.query.emulation || 'mobile';

  launchChromeAndRunLighthouse(req.query.url, flags)
    .then(results => {

      const categories = results['lhr']['categories'];
      const performance = Math.round(categories['performance']['score'] * 100);
      const pwa = Math.round(categories['pwa']['score'] * 100);
      const accessibility = Math.round(categories['accessibility']['score'] * 100);
      const bestPractices = Math.round(categories['best-practices']['score'] * 100);
      const seo = Math.round(categories['seo']['score'] * 100);
      res.setHeader('X-Lighthouse-scores', `${pwa};${performance};${accessibility};${bestPractices};${seo}`);

      const audits = results['lhr']['audits'];
      const ttfb = Math.round(audits['server-response-time']['numericValue']);
      const firstMeaningfulPaint = Math.round(audits['first-meaningful-paint']['numericValue']);
      const interactive = Math.round(audits['interactive']['numericValue']);
      const speedIndex = Math.round(audits['speed-index']['numericValue']);
      res.setHeader('X-Lighthouse-metrics', `${ttfb};${firstMeaningfulPaint};${interactive};${speedIndex}`);

      delete results.lhr.artifacts;

      let type = req.query.type || 'json';
      if (type === 'html') {
        results = ReportGenerator.generateReportHtml(results.lhr);
      }

      res.send(results);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({error: 'Could not execute lighthouse'});
    });
});

module.exports = router;
