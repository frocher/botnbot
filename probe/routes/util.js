const puppeteer = require('puppeteer');

const launchBrowser = async function () {
  const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
  return await puppeteer.launch({executablePath: chromePath, args: ['--no-sandbox']});
};

const getDefaultDimensions = function (emulation) {
  return {
    defaultWidth: emulation === 'mobile' ? 412 : 1280,
    defaultHeight: emulation === 'mobile' ? 732 : 960,
  };
};

const setPageViewport = function (page, req) {
  const emulation = req.query.emulation || 'mobile';
  const {defaultWidth, defaultHeight} = getDefaultDimensions(emulation);
  page.setViewport({
    width: req.query.width ? parseInt(req.query.width, 10) : defaultWidth,
    height: req.query.heigh ? parseInt(req.query.height, 10) : defaultHeight
  });
};

module.exports = {
  getDefaultDimensions: getDefaultDimensions,
  launchBrowser: launchBrowser,
  setPageViewport: setPageViewport,
};