const express = require('express');
const router = express.Router();
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator.js');
const {launchBrowser} = require('./util');
const {URL} = require('url');

const LR_PRESETS = {
  mobile: require('lighthouse/lighthouse-core/config/lr-mobile-config.js'),
  desktop: require('lighthouse/lighthouse-core/config/lr-desktop-config.js'),
};

function getScores(results) {
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
  return JSON.stringify(scores);
}

function getMetrics(results) {
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
  return JSON.stringify(metrics);
}

router.get('/', async (req, res) => {
  let browser = null;
  try {
    browser = await launchBrowser();
    const flags = {};
    flags.formFactor = req.query.emulation || 'mobile';
    flags.port = (new URL(browser.wsEndpoint())).port;
    if (flags.formFactor === 'mobile') {
      flags.screenEmulation = {
        mobile: true,
        disabled: false,
      };
    }
    const config = flags.formFactor === 'desktop' ? LR_PRESETS.desktop : LR_PRESETS.mobile;

    let results = await lighthouse(req.query.url, flags, config);

    res.setHeader('X-Lighthouse-scores', getScores(results));
    res.setHeader('X-Lighthouse-metrics', getMetrics(results));

    delete results.lhr.artifacts;

    let type = req.query.type || 'json';
    if (type === 'html') {
      results = ReportGenerator.generateReportHtml(results.lhr);
    }
    res.send(results);
  }
  catch (e) {
    console.error(e);
    res.status(500).send({error: 'Could not execute lighthouse'});
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
