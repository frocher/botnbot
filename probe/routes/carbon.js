const express = require('express');
const router = express.Router();
const {launchBrowser, setPageViewport} = require('./util');
const fetch = require('node-fetch');

const KWG_PER_GB = 1.805;
const RETURNING_VISITOR_PERCENTAGE = 0.75;
const FIRST_TIME_VIEWING_PERCENTAGE = 0.25;
const CARBON_PER_KWG_GRID = 475;
const CARBON_PER_KWG_RENEWABLE = 33.4;
const PERCENTAGE_OF_ENERGY_IN_DATACENTER = 0.1008;
const PERCENTAGE_OF_ENERGY_IN_TRANSMISSION_AND_END_USER = 0.8992;

const quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
const quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
const quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];


async function getPageInformations(page, url) {
  let encodedDataLength = 0;
  let requestsCount = 0;

  page._client.on('Network.loadingFinished', data => {
    if (typeof data.encodedDataLength !== 'undefined') encodedDataLength += parseInt(data.encodedDataLength);
  });

  page.on('request', () => {
    requestsCount++;
  });

  await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});

  const elements = await page.$$('*');

  return {bytes: encodedDataLength, elements: elements.length, requests: requestsCount};
}

function adjustData(first, second) {
  return (first * FIRST_TIME_VIEWING_PERCENTAGE) + (second * RETURNING_VISITOR_PERCENTAGE);
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

function computeQuantile(quantiles, value) {
  for (let i = 1; i < quantiles.length; i++) {
    if (value < quantiles[i]) {
      return i + (value - quantiles[i-1]) / (quantiles[i] - quantiles[i-1]);
    }
  }
  return quantiles.length;
}

function ecoIndex(bytes, requests, elements) {
  const q_dom = computeQuantile(quantiles_dom, elements);
  const q_size = computeQuantile(quantiles_size, bytes / 1024);
  const q_req = computeQuantile(quantiles_req, requests);

  return 100 - (5 * (3 * q_dom + q_size + 2 * q_req)) / 6;
}

/**
 * Return the url without the protocol.
 * @param {*} url
 */
function removeHttp(url) {
  const uri = new URL(url);
  return uri.hostname;
}

/**
 * Call the green web foundation to check hostings
 * @param {*} url
 */
async function checkGreenAPI(url) {
  const domain = removeHttp(url);
  const res = await fetch(`https://api.thegreenwebfoundation.org/greencheck/${domain}`);
  return await res.json();
}

router.get('/', async (req, res) => {
  let browser = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    setPageViewport(page, req);

    await page.setCacheEnabled(false);
    let first = await getPageInformations(page, req.query.url);
    await page.setCacheEnabled(true);
    let second = await getPageInformations(page, req.query.url);

    const greenCheck = await checkGreenAPI(req.query.url);

    const bytesAdjusted = adjustData(first.bytes, second.bytes);
    const elementsAdjusted = adjustData(first.elements, second.elements);
    const requestsAdjusted = adjustData(first.requests, second.requests);

    const energyFirst = energyConsumption(first.bytes);
    const energySecond = energyConsumption(second.bytes);
    const energyAdjusted = energyConsumption(bytesAdjusted);

    const ecoIndexFirst = ecoIndex(first.bytes, first.requests, first.elements);
    const ecoIndexSecond = ecoIndex(second.bytes, second.requests, second.elements);
    const ecoIndexAdjusted = ecoIndex(bytesAdjusted, requestsAdjusted, elementsAdjusted);

    let response = {
      host: greenCheck,
      bytes: {
        first: first.bytes,
        second: second.bytes,
        adjusted: bytesAdjusted,
      },
      requests: {
        first: first.requests,
        second: second.requests,
        adjusted: requestsAdjusted,
      },
      elements: {
        first: first.elements,
        second: second.elements,
        adjusted: elementsAdjusted,
      },
      co2: {
        grid: {
          first: getCo2Grid(energyFirst),
          second: getCo2Grid(energySecond),
          adjusted: getCo2Grid(energyAdjusted),
        },
        renewable: {
          first: getCo2Renewable(energyFirst),
          second: getCo2Renewable(energySecond),
          adjusted: getCo2Renewable(energyAdjusted),
        },
      },
      ecoIndex: {
        first: ecoIndexFirst,
        second: ecoIndexSecond,
        adjusted: ecoIndexAdjusted,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(response);
  }
  catch (e) {
    console.error(e);
    res.status(500).send({error: 'Could not check co2'});
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
