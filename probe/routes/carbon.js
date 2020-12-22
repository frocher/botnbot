const express = require('express');
const router = express.Router();
const {launchBrowser, setPageViewport} = require('./util');

const KWG_PER_GB = 1.805;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const CARBON_PER_KWG_GRID = 475;
const CARBON_PER_KWG_RENEWABLE = 33.4;
const PERCENTAGE_OF_ENERGY_IN_DATACENTER = 0.1008;
const PERCENTAGE_OF_ENERGY_IN_TRANSMISSION_AND_END_USER = 0.8992;
const CO2_GRAMS_TO_LITRES = 0.5562;

async function getPageInformations(page, url) {
  let encodedDataLength = 0;

  page._client.on('Network.loadingFinished', data => {
    if (typeof data.encodedDataLength !== 'undefined') encodedDataLength += parseInt(data.encodedDataLength);
  });

  await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
  return encodedDataLength;
}

function adjustDataTransfer(firstBytes, secondBytes) {
  return (firstBytes * FIRST_TIME_VIEWING_PERCENTAGE) + (secondBytes * RETURNING_VISITOR_PERCENTAGE);
}

function energyConsumption(bytes) {
  return bytes * (KWG_PER_GB / 1073741824);
}

function getCo2Grid(energy) {
  return energy * CARBON_PER_KWG_GRID;
}

function getCo2Renewable(energy) {
  return (energy * PERCENTAGE_OF_ENERGY_IN_DATACENTER * CARBON_PER_KWG_RENEWABLE) +
    (energy * PERCENTAGE_OF_ENERGY_IN_TRANSMISSION_AND_END_USER * CARBON_PER_KWG_GRID);
}

function co2ToLitres(co2) {
  return co2 * CO2_GRAMS_TO_LITRES;
}

router.get('/', function (req, res) {
  launchBrowser().then(async browser => {
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    setPageViewport(page, req);

    await page.setCacheEnabled(false);
    let firstBytes = await getPageInformations(page, req.query.url);
    await page.setCacheEnabled(true);
    let secondBytes = await getPageInformations(page, req.query.url);

    let bytesAdjusted = adjustDataTransfer(firstBytes, secondBytes);
    let energy = energyConsumption(bytesAdjusted);
    let co2Grid = getCo2Grid(energy);
    let co2Renewable = getCo2Renewable(energy);

    let response = {
      bytes: {
        first: firstBytes,
        second: secondBytes,
        adjusted: bytesAdjusted,
      },
      co2: {
        grid: {
          grams: co2Grid,
          litres: co2ToLitres(co2Grid),
        },
        renewable: {
          grams: co2Renewable,
          litres: co2ToLitres(co2Renewable),
        },
      }
    };

    await browser.close();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(response);
  }).catch(e => {
    console.error(e);
    res.status(500).send({error: 'Could not check co2'});
  });
});

module.exports = router;
