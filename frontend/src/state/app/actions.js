import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../../utilities/api';

// ***** App

export const fetchEnvironmentSuccess = createAction('ENVIRONMENT_FETCH_SUCCESS');
export const fetchEnvironmentError = createAction('ENVIRONMENT_FETCH_ERROR');
export const showInstallPrompt = createAction('SHOW_INSTALL_PROMPT');

export const updatePeriod = createAction('PERIOD_UPDATE', (period) => ({
  payload: {
    start: period.start.getTime(),
    end: period.end.getTime(),
  },
}));

export const updateRoute = createAction('UPDATE_ROUTE');
export const updateMessage = createAction('UPDATE_MESSAGE');

export const loadEnvironment = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/environment', {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchEnvironmentSuccess(response));
      } else {
        dispatch(fetchEnvironmentError(response));
      }
    },
  });
};

export const fetchSubscriptionPlansSuccess = createAction('PLANS_FETCH_SUCCESS');
export const fetchSubscriptionPlansError = createAction('PLANS_FETCH_ERROR');

export const loadSubscriptionPlans = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/plans', {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchSubscriptionPlansSuccess(response));
      } else {
        dispatch(fetchSubscriptionPlansError(response));
      }
    },
  });
};
