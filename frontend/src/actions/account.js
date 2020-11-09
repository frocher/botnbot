import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../common';

// ***** User account management

export const fetchUserSuccess = createAction('USER_FETCH_SUCCESS');
export const fetchUserError = createAction('USER_FETCH_ERROR');

export const loadUser = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/users/-1', {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchUserSuccess(response));
      } else {
        dispatch(fetchUserError(response));
      }
    },
  });
};

export const updateUserStart = createAction('USER_FETCH_START');
export const updateUserSuccess = createAction('USER_UPDATE_SUCCESS');
export const updateUserError = createAction('USER_UPDATE_ERROR');

export const updateUser = (id, user) => async (dispatch) => {
  dispatch(updateUserStart());
  getResource({
    url: getRequestUrl(`/users/${id}`, user),
    method: 'PUT',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(updateUserSuccess(response));
      } else {
        dispatch(updateUserError(response));
      }
    },
  });
};

export const savePushSubscriptionSuccess = createAction('PUSH_SUBSCRIPTION_SUCCESS');
export const savePushSubscriptionError = createAction('PUSH_SUBSCRIPTION_ERROR');

export const savePushSubscription = (subscription) => async (dispatch) => {
  getResource({
    url: getRequestUrl('/users/-1/save-subscription', { subscription: JSON.stringify(subscription) }),
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(savePushSubscriptionSuccess());
      } else {
        dispatch(savePushSubscriptionError(response));
      }
    },
  });
};

export const fetchStripeSubscriptionSuccess = createAction('STRIPE_SUBSCRIPTION_FETCH_SUCCESS');
export const fetchStripeSubscriptionError = createAction('STRIPE_SUBSCRIPTION_FETCH_ERROR');

export const loadStripeSubscription = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/users/-1/subscription', {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchStripeSubscriptionSuccess(response));
      } else {
        dispatch(fetchStripeSubscriptionError(response));
      }
    },
  });
};

export const updateStripeSubscriptionSuccess = createAction('STRIPE_SUBSCRIPTION_UPDATE_SUCCESS');
export const updateStripeSubscriptionError = createAction('STRIPE_SUBSCRIPTION_UPDATE_ERROR');

export const updateStripeSubscription = (stripePlan) => async (dispatch) => {
  getResource({
    url: getRequestUrl('/users/-1/subscription', { stripePlan }),
    method: 'PUT',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(updateStripeSubscriptionSuccess(response));
      } else {
        dispatch(updateStripeSubscriptionError(response));
      }
    },
  });
};

export const deleteStripeSubscriptionSuccess = createAction('STRIPE_SUBSCRIPTION_DELETE_SUCCESS');
export const deleteStripeSubscriptionError = createAction('STRIPE_SUBSCRIPTION_DELETE_ERROR');

export const deleteStripeSubscription = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/users/-1/subscription', {}),
    method: 'DELETE',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(deleteStripeSubscriptionSuccess(response));
      } else {
        dispatch(deleteStripeSubscriptionError(response));
      }
    },
  });
};
