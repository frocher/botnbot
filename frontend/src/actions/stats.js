import { getRequestUrl, getResource } from '../common';

// ***** Page stats management

export const fetchPageStatsStart = () => ({
    type: 'PAGE_STATS_START',
  });

export const fetchPageStatsSuccess = stats => ({
  type: 'PAGE_STATS_FETCH_SUCCESS',
  stats,
});

export const fetchPageStatsError = errors => ({
  type: 'PAGE_STATS_FETCH_ERROR',
  errors,
});

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


export const loadPageStats = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchPageStatsStart());

    getResource({
      url: getRequestUrl(`/pages/${pageId}/stats`, { start: period.start, end: period.end }),
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
          dispatch(fetchPageStatsError(response.errors));
        }
      },
    });
  });
};

export const fetchLighthouseDetailsStart = () => ({
  type: 'LIGHTHOUSE_DETAILS_START',
});

export const fetchLighthouseDetailsSuccess = details => ({
  type: 'LIGHTHOUSE_DETAILS_FETCH_SUCCESS',
  details,
});

export const fetchLighthouseDetailsError = errors => ({
  type: 'LIGHTHOUSE_DETAILS_FETCH_ERROR',
  errors,
});

export const loadLighthouseDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchLighthouseDetailsStart());
    getResource({
      url: getRequestUrl(`/pages/${pageId}/lighthouse`, { start: period.start, end: period.end }),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchLighthouseDetailsSuccess(response));
        } else {
          dispatch(fetchLighthouseDetailsError(response.errors));
        }
      },
    });
  });
};

export const fetchUptimeDetailsStart = () => ({
  type: 'UPTIME_DETAILS_START',
});

export const fetchUptimeDetailsSuccess = details => ({
  type: 'UPTIME_DETAILS_FETCH_SUCCESS',
  details,
});

export const fetchUptimeDetailsError = errors => ({
  type: 'UPTIME_DETAILS_FETCH_ERROR',
  errors,
});

export const loadUptimeDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchUptimeDetailsStart());
    getResource({
      url: getRequestUrl(`/pages/${pageId}/uptime`, { start: period.start, end: period.end }),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchUptimeDetailsSuccess(response));
        } else {
          dispatch(fetchUptimeDetailsError(response.errors));
        }
      },
    });
  });
};

export const fetchAssetsDetailsStart = () => ({
  type: 'ASSETS_DETAILS_START',
});

export const fetchAssetsDetailsSuccess = details => ({
  type: 'ASSETS_DETAILS_FETCH_SUCCESS',
  details,
});

export const fetchAssetsDetailsError = errors => ({
  type: 'ASSETS_DETAILS_FETCH_ERROR',
  errors,
});

export const loadAssetsDetails = (pageId, period) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(fetchAssetsDetailsStart());
    getResource({
      url: getRequestUrl(`/pages/${  pageId  }/assets`, { start: period.start, end: period.end }),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchAssetsDetailsSuccess(response));
        } else {
          dispatch(fetchAssetsDetailsError(response.errors));
        }
      },
    });
  });
};
