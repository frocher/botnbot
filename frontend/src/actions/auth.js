import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../common';

// ***** Authentication

/**
 * Extract credentials from a HTTP response
 */
const extractCredentials = (xhr) => ({
  'access-token': xhr.getResponseHeader('access-token'),
  uid: xhr.getResponseHeader('uid'),
  client: xhr.getResponseHeader('client'),
  'token-type': 'Bearer',
});

export const signInSuccess = createAction('SIGN_IN_SUCCESS');
export const signInError = createAction('SIGN_IN_ERROR');

export const signin = (email, password) => async (dispatch) => {
  const url = getRequestUrl('/auth/sign_in', { email, password });
  getResource({
    url,
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(signInSuccess(extractCredentials(e.target)));
      } else {
        dispatch(signInError(response));
      }
    },
  });
};

export const signUpSuccess = createAction('SIGN_UP_SUCCESS');
export const signUpError = createAction('SIGN_UP_ERROR');

export const signup = (name, email, password, confirmation, successUrl) => async (dispatch) => {
  const url = getRequestUrl('/auth/', {
    name,
    email,
    password,
    password_confirmation: confirmation,
    confirm_success_url: successUrl,
  });

  getResource({
    url,
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(signUpSuccess());
      } else {
        dispatch(signUpError(response));
      }
    },
  });
};


export const forgotPasswordSuccess = createAction('FORGOT_PASSWORD_SUCCESS');
export const forgotPasswordError = createAction('FORGOT_PASSWORD_ERROR');

export const forgotPassword = (email, redirectUrl) => async (dispatch) => {
  const url = getRequestUrl('/auth/password', {
    email,
    redirect_url: redirectUrl,
  });

  getResource({
    url,
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(forgotPasswordSuccess(response.message));
      } else {
        dispatch(forgotPasswordError(response));
      }
    },
  });
};

export const updatePasswordSuccess = createAction('UPDATE_PASSWORD_SUCCESS');
export const updatePasswordError = createAction('UPDATE_PASSWORD_ERROR');

export const updatePassword = (password, passwordConfirmation, headers) => async (dispatch) => {
  const url = getRequestUrl('/auth/password', {
    password,
    password_confirmation: passwordConfirmation,
  });

  getResource({
    url,
    method: 'PUT',
    headers,
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(updatePasswordSuccess(response.message));
      } else {
        dispatch(updatePasswordError(response));
      }
    },
  });
};

export const signout = createAction('SIGN_OUT');
