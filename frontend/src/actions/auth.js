import { getRequestUrl, getResource } from '../common';

// ***** Authentication

/**
 * Extract credentials from a HTTP response
 */
const extractCredentials = xhr => ({
  'access-token': xhr.getResponseHeader('access-token'),
  uid: xhr.getResponseHeader('uid'),
  client: xhr.getResponseHeader('client'),
  'token-type': 'Bearer',
});

export const signInSuccess = credentials => ({
  type: 'SIGN_IN_SUCCESS',
  credentials,
});

export const signInError = errors => ({
  type: 'SIGN_IN_ERROR',
  errors,
});

export const signin = (email, password) => (dispatch) => {
  dispatch((dispatch) => {
    const url = getRequestUrl('/auth/sign_in', { email, password });
    getResource({
      url,
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(signInSuccess(extractCredentials(e.target)));
        } else {
          dispatch(signInError(response.errors));
        }
      },
    });
  });
};

export const signUpSuccess = () => ({
  type: 'SIGN_UP_SUCCESS',
});

export const signUpError = errors => ({
  type: 'SIGN_UP_ERROR',
  errors,
});


export const signup = (name, email, password, confirmation, successUrl) => (dispatch) => {
  dispatch((dispatch) => {
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
          dispatch(signUpError(response.errors));
        }
      },
    });
  });
};

export const forgotPasswordSuccess = message => ({
  type: 'FORGOT_PASSWORD_SUCCESS',
  message,
});

export const forgotPasswordError = errors => ({
  type: 'FORGOT_PASSWORD_ERROR',
  message: errors[0],
});

export const forgotPassword = (email, redirectUrl) => (dispatch) => {
  dispatch((dispatch) => {
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
          dispatch(forgotPasswordError(response.errors));
        }
      },
    });
  });
};

export const updatePasswordSuccess = message => ({
  type: 'UPDATE_PASSWORD_SUCCESS',
  message,
});

export const updatePasswordError = errors => ({
  type: 'UPDATE_PASSWORD_ERROR',
  errors,
});

export const updatePassword = (password, passwordConfirmation, headers) => (dispatch) => {
  dispatch((dispatch) => {
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
          dispatch(updatePasswordError(response.errors));
        }
      },
    });
  });
};

export const signout = () => ({
  type: 'SIGN_OUT',
});
