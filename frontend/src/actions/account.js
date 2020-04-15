import { getRequestUrl, getResource } from '../common';

// ***** User account management

export const fetchUserSuccess = user => ({
  type: 'USER_FETCH_SUCCESS',
  user,
});

export const fetchUserError = message => ({
  type: 'USER_FETCH_ERROR',
  message,
});

export const loadUser = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1', {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchUserSuccess(response));
        } else {
          dispatch(fetchUserError(response.errors));
        }
      },
    });
  });
};

export const updateUserStart = () => ({
  type: 'USER_FETCH_START',
});

export const updateUserSuccess = user => ({
  type: 'USER_UPDATE_SUCCESS',
  user,
});

export const updateUserError = errors => ({
  type: 'USER_UPDATE_ERROR',
  errors,
});

export const updateUser = (id, user) => (dispatch) => {
  dispatch((dispatch) => {
    dispatch(updateUserStart());
    getResource({
      url: getRequestUrl(`/users/${id}`, user),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updateUserSuccess(response));
        } else {
          dispatch(updateUserError(response.errors));
        }
      },
    });
  });
};

export const savePushSubscriptionSuccess = () => ({
  type: 'PUSH_SUBSCRIPTION_SUCCESS',
});

export const savePushSubscriptionError = errors => ({
  type: 'PUSH_SUBSCRIPTION_ERROR',
  errors,
});

export const savePushSubscription = subscription => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/save-subscription', { subscription: JSON.stringify(subscription) }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(savePushSubscriptionSuccess());
        } else {
          dispatch(savePushSubscriptionError(response.errors));
        }
      },
    });
  });
};

export const fetchStripeSubscriptionSuccess = subscription => ({
  type: 'STRIPE_SUBSCRIPTION_FETCH_SUCCESS',
  subscription,
});

export const fetchStripeSubscriptionError = message => ({
  type: 'STRIPE_SUBSCRIPTION_FETCH_ERROR',
  message,
});

export const loadStripeSubscription = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/subscription', {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchStripeSubscriptionSuccess(response));
        } else {
          dispatch(fetchStripeSubscriptionError(response.errors));
        }
      },
    });
  });
};

export const createStripeSubscriptionSuccess = subscription => ({
  type: 'STRIPE_SUBSCRIPTION_CREATE_SUCCESS',
  subscription,
});

export const createStripeSubscriptionError = message => ({
  type: 'STRIPE_SUBSCRIPTION_CREATE_ERROR',
  message,
});

export const createStripeSubscription = (stripeEmail, stripeToken, stripePlan) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/subscription', { stripeEmail, stripeToken, stripePlan }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(createStripeSubscriptionSuccess(response));
        } else {
          dispatch(createStripeSubscriptionError(response.errors));
        }
      },
    });
  });
};

export const updateStripeSubscriptionSuccess = subscription => ({
  type: 'STRIPE_SUBSCRIPTION_UPDATE_SUCCESS',
  subscription,
});

export const updateStripeSubscriptionError = message => ({
  type: 'STRIPE_SUBSCRIPTION_UPDATE_ERROR',
  message,
});

export const updateStripeSubscription = stripePlan => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/subscription', { stripePlan }),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updateStripeSubscriptionSuccess(response));
        } else {
          dispatch(updateStripeSubscriptionError(response.errors));
        }
      },
    });
  });
};

export const deleteStripeSubscriptionSuccess = subscription => ({
  type: 'STRIPE_SUBSCRIPTION_DELETE_SUCCESS',
  subscription,
});

export const deleteStripeSubscriptionError = message => ({
  type: 'STRIPE_SUBSCRIPTION_DELETE_ERROR',
  message,
});

export const deleteStripeSubscription = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/subscription', {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(deleteStripeSubscriptionSuccess(response));
        } else {
          dispatch(deleteStripeSubscriptionError(response.errors));
        }
      },
    });
  });
};
