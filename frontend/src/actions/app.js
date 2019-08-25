import { getRequestUrl, getResource } from '../common';

// ***** App

export const showInstallPrompt = event => ({
  type: 'SHOW_INSTALL_PROMPT',
  event,
});

export const updateRoute = route => ({
  type: 'UPDATE_ROUTE',
  route,
  errors: [],
});

export const updateMessage = message => ({
  type: 'UPDATE_MESSAGE',
  message,
});

export const updatePeriod = period => ({
  type: 'UPDATE_PERIOD',
  period,
});

export const fetchEnvironmentSuccess = keys => ({
  type: 'ENVIRONMENT_FETCH_SUCCESS',
  analyticsKey: keys.GOOGLE_ANALYTICS_KEY,
  pushKey: keys.PUSH_KEY,
  stripeKey: keys.STRIPE_KEY,
});

export const fetchEnvironmentError = message => ({
  type: 'ENVIRONMENT_FETCH_ERROR',
  message,
});

export const loadEnvironment = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/environment', {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchEnvironmentSuccess(response));
        } else {
          dispatch(fetchEnvironmentError(response.errors));
        }
      },
    });
  });
};

export const fetchSubscriptionPlansSuccess = plans => ({
  type: 'PLANS_FETCH_SUCCESS',
  plans,
});

export const fetchSubscriptionPlansError = message => ({
  type: 'PLANS_FETCH_ERROR',
  message,
});

export const loadSubscriptionPlans = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/plans', {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchSubscriptionPlansSuccess(response));
        } else {
          dispatch(fetchSubscriptionPlansError(response.errors));
        }
      },
    });
  });
};
