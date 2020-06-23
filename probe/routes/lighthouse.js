const express = require('express');
const router = express.Router();
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator.js');

const LR_PRESETS = {
  mobile: require('lighthouse/lighthouse-core/config/lr-mobile-config.js'),
  desktop: require('lighthouse/lighthouse-core/config/lr-desktop-config.js'),
};

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
  const config = flags.emulatedFormFactor === 'desktop' ? LR_PRESETS.desktop : LR_PRESETS.mobile;

  launchChromeAndRunLighthouse(req.query.url, flags, config)
    .then(results => {

      const categories = results['lhr']['categories'];
      const performance = Math.round(categories['performance']['score'] * 100);
      const pwa = Math.round(categories['pwa']['score'] * 100);
      const accessibility = Math.round(categories['accessibility']['score'] * 100);
      const bestPractices = Math.round(categories['best-practices']['score'] * 100);
      const seo = Math.round(categories['seo']['score'] * 100);
      const scores = {
        pwa,
        performance,
        accessibility,
        bestPractices,
        seo,
      };
      res.setHeader('X-Lighthouse-scores', JSON.stringify(scores));

      const audits = results['lhr']['audits'];
      const ttfb = Math.round(audits['server-response-time']['numericValue']);
      const lcp = Math.round(audits['largest-contentful-paint']['numericValue']);
      const tbt = Math.round(audits['total-blocking-time']['numericValue']);
      const cls = Math.round(audits['cumulative-layout-shift']['numericValue']);
      const speedIndex = Math.round(audits['speed-index']['numericValue']);
      const metrics = {
        ttfb,
        lcp,
        tbt,
        cls,
        speedIndex,
      };
      res.setHeader('X-Lighthouse-metrics', JSON.stringify(metrics));

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
