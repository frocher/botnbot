const chromeLauncher = require('chrome-launcher');
const chc = require('chrome-har-capturer');
const express = require('express');
const router = express.Router();

function launchChrome(headless = true) {
  return chromeLauncher.launch({
    chromeFlags: [
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  });
}

router.get('/', function (req, res, next) {
  launchChrome()
    .then(chrome => {
      const opts = {port: chrome.port};
      const emulation = req.query.emulation || 'mobile';
      opts.width = emulation === 'mobile' ? 412 : 1350;
      opts.height = emulation === 'mobile' ? 732 : 940;
      const urls = [req.query.url];

      res.type('application/json');

      chc.run(urls, opts)
        .on('load', (url) => {
          process.stdout.write(url);
        })
        .on('har', (har) => {
          if (!res.headersSent) {
            const json = JSON.stringify(har, null, 4);
            res.send(json);
          }
        })
        .on('done', (url) => {
          process.stdout.write('✓\n');
          chrome.kill();
        })
        .on('fail', (url, err) => {
          process.stdout.write('- error\n');
          console.log(err);
          res.status(500).send({error: 'Error generating har'});
          chrome.kill();
        });
    });
});

module.exports = router;
