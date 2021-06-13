/* eslint-disable no-mixed-operators */
import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../../utilities/api';

// ***** Page stats management

export const fetchPageStatsStart = createAction('PAGE_STATS_START');
export const fetchPageStatsSuccess = createAction('PAGE_STATS_FETCH_SUCCESS');
export const fetchPageStatsError = createAction('PAGE_STATS_FETCH_ERROR');

/* eslint no-param-reassign: ["error", { "props": false }] */
const _updateUptime = (data) => {
  data.summary = Math.round(data.summary * 10000) / 100;
  for (let i = 0; i < data.values.length; i += 1) {
    data.values[i].value = Math.round(data.values[i].value * 10000) / 100;
  }
};

const _updateCount = (data) => {
  for (let iSeries = 0; iSeries < data.length; iSeries += 1) {
    const serie = data[iSeries];
    serie.summary = Math.round(serie.summary);
    for (let iValue = 0; iValue < serie.values.length; iValue += 1) {
      serie.values[iValue].value = Math.round(serie.values[iValue].value);
    }
  }
};

const _updateBytes = (data) => {
  for (let iSeries = 0; iSeries < data.length; iSeries += 1) {
    const serie = data[iSeries];
    serie.summary = Math.round(serie.summary * 10 / 1024) / 10;
    for (let iValue = 0; iValue < serie.values.length; iValue += 1) {
      serie.values[iValue].value = Math.round(serie.values[iValue].value * 10 / 1024) / 10;
    }
  }
};

export const loadPageStats = (pageId, period) => async (dispatch) => {
  dispatch(fetchPageStatsStart());

  getResource({
    url: getRequestUrl(`/pages/${pageId}/stats`, { start: new Date(period.start), end: new Date(period.end) }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        _updateUptime(response.uptime[0]);
        _updateCount(response.lighthouse);
        _updateCount(response.performance);
        _updateBytes(response.bytes);
        _updateCount(response.requests);

        dispatch(fetchPageStatsSuccess(response));
      } else {
        dispatch(fetchPageStatsError(response));
      }
    },
  });
};

export const fetchLighthouseDetailsStart = createAction('LIGHTHOUSE_DETAILS_START');
export const fetchLighthouseDetailsSuccess = createAction('LIGHTHOUSE_DETAILS_FETCH_SUCCESS');
export const fetchLighthouseDetailsError = createAction('LIGHTHOUSE_DETAILS_FETCH_ERROR');

export const loadLighthouseDetails = (pageId, period) => async (dispatch) => {
  dispatch(fetchLighthouseDetailsStart());
  getResource({
    url: getRequestUrl(`/pages/${pageId}/lighthouse`, { start: new Date(period.start), end: new Date(period.end) }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchLighthouseDetailsSuccess(response));
      } else {
        dispatch(fetchLighthouseDetailsError(response));
      }
    },
  });
};

export const fetchUptimeDetailsStart = createAction('UPTIME_DETAILS_START');
export const fetchUptimeDetailsSuccess = createAction('UPTIME_DETAILS_FETCH_SUCCESS');
export const fetchUptimeDetailsError = createAction('UPTIME_DETAILS_FETCH_ERROR');

export const loadUptimeDetails = (pageId, period) => async (dispatch) => {
  dispatch(fetchUptimeDetailsStart());
  getResource({
    url: getRequestUrl(`/pages/${pageId}/uptime`, { start: new Date(period.start), end: new Date(period.end) }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchUptimeDetailsSuccess(response));
      } else {
        dispatch(fetchUptimeDetailsError(response));
      }
    },
  });
};

export const fetchAssetsDetailsStart = createAction('ASSETS_DETAILS_START');
export const fetchAssetsDetailsSuccess = createAction('ASSETS_DETAILS_FETCH_SUCCESS');
export const fetchAssetsDetailsError = createAction('ASSETS_DETAILS_FETCH_ERROR');

export const loadAssetsDetails = (pageId, period) => async (dispatch) => {
  dispatch(fetchAssetsDetailsStart());
  getResource({
    url: getRequestUrl(`/pages/${pageId}/assets`, { start: new Date(period.start), end: new Date(period.end) }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchAssetsDetailsSuccess(response));
      } else {
        dispatch(fetchAssetsDetailsError(response));
      }
    },
  });
};

export const fetchCarbonDetailsStart = createAction('CARBON_DETAILS_START');
export const fetchCarbonDetailsSuccess = createAction('CARBON_DETAILS_FETCH_SUCCESS');
export const fetchCarbonDetailsError = createAction('CARBON_DETAILS_FETCH_ERROR');

export const loadCarbonDetails = (pageId, period) => async (dispatch) => {
  dispatch(fetchCarbonDetailsStart());
  getResource({
    url: getRequestUrl(`/pages/${pageId}/carbon`, { start: new Date(period.start), end: new Date(period.end) }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchCarbonDetailsSuccess(response));
      } else {
        dispatch(fetchCarbonDetailsError(response));
      }
    },
  });
};
