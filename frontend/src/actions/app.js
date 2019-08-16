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

// ***** User management

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

export const saveSubscriptionSuccess = () => ({
  type: 'SUBSCRIPTION_SUCCESS',
});

export const saveSubscriptionError = errors => ({
  type: 'SUBSCRIPTION_ERROR',
  errors,
});

export const saveSubscription = subscription => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/users/-1/save-subscription', { subscription: JSON.stringify(subscription) }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(saveSubscriptionSuccess());
        } else {
          dispatch(saveSubscriptionError(response.errors));
        }
      },
    });
  });
};

// ***** Pages management

export const fetchPagesSuccess = pages => ({
  type: 'PAGES_FETCH_SUCCESS',
  pages,
});

export const fetchPagesError = errors => ({
  type: 'PAGES_FETCH_ERROR',
  errors,
});

export const loadPages = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', { per_page: 9999 }),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPagesSuccess(response));
        } else {
          dispatch(fetchPagesError(response.errors));
        }
      },
    });
  });
};

export const fetchPageSuccess = page => ({
  type: 'PAGE_FETCH_SUCCESS',
  page,
});

export const fetchPageError = errors => ({
  type: 'PAGE_FETCH_ERROR',
  errors,
});

export const loadPage = id => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageSuccess(response));
        } else {
          dispatch(fetchPageError(response.errors));
        }
      },
    });
  });
};

export const createPageSuccess = () => ({
  type: 'PAGE_CREATE_SUCCESS',
});

export const createPageError = errors => ({
  type: 'PAGE_CREATE_ERROR',
  errors,
});

export const createPage = (name, url, device) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', { name, url, device }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(createPageSuccess());
        } else {
          dispatch(createPageError(response.errors));
        }
      },
    });
  });
};

export const updatePageSuccess = page => ({
  type: 'PAGE_UPDATE_SUCCESS',
  page,
});

export const updatePageError = errors => ({
  type: 'PAGE_UPDATE_ERROR',
  errors,
});

export const updatePage = (id, page) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, page),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updatePageSuccess(response));
        } else {
          dispatch(updatePageError(response.errors));
        }
      },
    });
  });
};


export const deletePageSuccess = page => ({
  type: 'PAGE_DELETE_SUCCESS',
  page,
});

export const deletePageError = errors => ({
  type: 'PAGE_DELETE_ERROR',
  errors,
});

export const deletePage = id => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(deletePageSuccess(response));
        } else {
          dispatch(deletePageError(response.errors));
        }
      },
    });
  });
};

// ***** Page members management

export const fetchPageMembersSuccess = members => ({
  type: 'PAGE_MEMBERS_FETCH_SUCCESS',
  members,
});

export const fetchPageMembersError = errors => ({
  type: 'PAGE_MEMBERS_FETCH_ERROR',
  errors,
});

export const loadPageMembers = pageId => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members`, {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageMembersSuccess(response));
        } else {
          dispatch(fetchPageMembersError(response.errors));
        }
      },
    });
  });
};

export const createPageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_CREATE_SUCCESS',
  member,
});

export const createPageMemberError = message => ({
  type: 'PAGE_MEMBER_CREATE_ERROR',
  message,
});

export const createPageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members`, member),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          this.loadPageMembers(pageId);
          dispatch(createPageMemberSuccess(response));
        } else {
          dispatch(createPageMemberError(response.message));
        }
      },
    });
  });
};

export const updatePageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_UPDATE_SUCCESS',
  member,
});

export const updatePageMemberError = message => ({
  type: 'PAGE_MEMBER_UPDATE_ERROR',
  message,
});

export const updatePageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: this.getRequestUrl(`/pages/${pageId}/members/${member.id}`, member),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(updatePageMemberSuccess(response));
        } else {
          dispatch(updatePageMemberError(response.message));
        }
      },
    });
  });
};

export const deletePageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_DELETE_SUCCESS',
  member,
});

export const deletePageMemberError = message => ({
  type: 'PAGE_MEMBER_DELETE_ERROR',
  message,
});

export const deletePageMember = (pageId, memberId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members/${memberId}`, {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(deletePageMemberSuccess(response));
        } else {
          dispatch(deletePageMemberError(response.message));
        }
      },
    });
  });
};


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
          _updateCount(response.lighthouse);
          _updateUptime(response.uptime[0]);
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


// ***** Page budgets management

export const fetchBudgetsSuccess = budgets => ({
  type: 'BUDGETS_FETCH_SUCCESS',
  budgets,
});

export const fetchBudgetsError = errors => ({
  type: 'BUDGETS_FETCH_ERROR',
  errors,
});

export const loadBudgets = pageId => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/budgets`, {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchBudgetsSuccess(response));
        } else {
          dispatch(fetchBudgetsError(response.errors));
        }
      },
    });
  });
};

export const createBudgetSuccess = () => ({
  type: 'BUDGET_CREATE_SUCCESS',
});

export const createBudgetError = errors => ({
  type: 'BUDGET_CREATE_ERROR',
  errors,
});

export const createBudget = (pageId, category, item, budget) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/budgets`, { category, item, budget }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadBudgets(pageId));
          dispatch(createBudgetSuccess());
        } else {
          dispatch(createBudgetError(response.errors));
        }
      },
    });
  });
};

export const deleteBudgetSuccess = budget => ({
  type: 'BUDGET_DELETE_SUCCESS',
  budget,
});

export const deleteBudgetError = errors => ({
  type: 'BUDGET_DELETE_ERROR',
  errors,
});

export const deleteBudget = (pageId, budgetId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/budgets/${budgetId}`, {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadBudgets(pageId));
          dispatch(deleteBudgetSuccess(response));
        } else {
          dispatch(deleteBudgetError(response.errors));
        }
      },
    });
  });
};
