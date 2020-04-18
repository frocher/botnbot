import { addDays } from 'date-fns/esm';

import { fetchCredentials } from '../common';

// Initial state
const initial = {
  // Google Analytics key
  analyticsKey: null,

  // Push notification key
  pushKey: null,

  // Text for message toast
  message: {
    text: '',
    counter: 0,
  },

  // User credentials for API
  credentials: fetchCredentials(),

  // Form validation errors
  errors: [],

  // Selected period
  period: { start: addDays(new Date(), -30), end: new Date() },

  // Loaded pages
  pages: undefined,

  // Current page
  page: undefined,

  // Members of current page
  page_members: undefined,

  // Statistics of current page
  page_stats: undefined,

  // Lighthouse details of current page
  lighthouse_details: undefined,

  // Uptime details of current page
  uptime_details: undefined,

  // Assets details of current page
  assets_details: undefined,
};


const app = (state = initial, action) => {
  switch (action.type) {
    case 'SHOW_INSTALL_PROMPT':
      return Object.assign({}, state, {
        promptEvent: action.event,
      });

    case 'UPDATE_ROUTE':
      return Object.assign({}, state, {
        route: action.route,
      });

    case 'ENVIRONMENT_FETCH_SUCCESS':
      return Object.assign({}, state, {
        analyticsKey: action.analyticsKey,
        pushKey: action.pushKey,
        stripeKey: action.stripeKey,
      });

    case 'PLANS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        subscriptionPlans: action.plans,
      });

    case 'UPDATE_MESSAGE':
      return Object.assign({}, state, {
        message: { text: action.message, counter: state.message.counter + 1 },
      });

    case 'UPDATE_PERIOD':
      return Object.assign({}, state, {
        period: action.period,
      });

    case 'SIGN_IN_SUCCESS':
      sessionStorage.setItem('credentials', JSON.stringify(action.credentials));
      return Object.assign({}, state, {
        credentials: action.credentials,
        route: 'home',
      });

    case 'ENVIRONMENT_FETCH_ERROR':
    case 'PLANS_FETCH_ERROR':
    case 'SIGN_IN_ERROR':
    case 'USER_FETCH_ERROR':
    case 'PAGES_FETCH_ERROR':
    case 'PAGE_FETCH_ERROR':
    case 'PAGE_MEMBERS_FETCH_ERROR':
    case 'STRIPE_SUBSCRIPTION_CREATE_ERROR':
    case 'PAGE_STATS_FETCH_ERROR': {
      const message = action.errors !== undefined ? action.errors[0] : 'Oops something went wrong.';
      return Object.assign({}, state, {
        message: { text: message, counter: state.message.counter + 1 },
      });
    }

    case 'SIGN_UP_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Sign up successful. An activation email has been sent to you.', counter: state.message.counter + 1 },
      });

    case 'SIGN_UP_ERROR':
      if (action.errors) {
        return Object.assign({}, state, {
          errors: action.errors,
        });
      }
      return Object.assign({}, state, {
        message: { text: 'Unknown error. Can\'t signup.', counter: state.message.counter + 1 },
      });

    case 'FORGOT_PASSWORD_SUCCESS':
    case 'FORGOT_PASSWORD_ERROR':
      return Object.assign({}, state, {
        message: { text: action.message, counter: state.message.counter + 1 },
      });

    case 'UPDATE_PASSWORD_SUCCESS':
      return Object.assign({}, state, {
        message: { text: action.message, counter: state.message.counter + 1 },
        route: 'signin',
      });

    case 'UPDATE_PASSWORD_ERROR':
      return Object.assign({}, state, {
        errors: action.errors,
      });

    case 'SIGN_OUT':
      sessionStorage.removeItem('credentials');
      return Object.assign({}, state, {
        credentials: null,
        route: 'signin',
      });

    case 'USER_FETCH_SUCCESS':
      return Object.assign({}, state, {
        user: action.user,
      });

    case 'USER_UPDATE_START':
      return Object.assign({}, state, {
        errors: [],
      });

    case 'USER_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Account informations have been updated', counter: state.message.counter + 1 },
        route: 'home',
      });

    case 'USER_UPDATE_ERROR':
      return Object.assign({}, state, {
        errors: action.errors,
      });

    case 'STRIPE_SUBSCRIPTION_FETCH_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.subscription,
      });

    case 'STRIPE_SUBSCRIPTION_CREATE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.subscription,
        message: { text: 'Your paid subscription has been created', counter: state.message.counter + 1 },
      });

    case 'STRIPE_SUBSCRIPTION_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.subscription,
        message: { text: 'Your paid subscription has been updated', counter: state.message.counter + 1 },
      });

    case 'STRIPE_SUBSCRIPTION_DELETE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.subscription,
        message: { text: 'Your paid subscription has been deleted', counter: state.message.counter + 1 },
      });

    case 'PAGES_FETCH_SUCCESS':
      return Object.assign({}, state, {
        pages: action.pages,
      });

    case 'PAGE_FETCH_SUCCESS':
      return Object.assign({}, state, {
        page: action.page,
      });

    case 'PAGE_MEMBERS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        page_members: action.members,
      });

    case 'PAGE_STATS_START':
      return Object.assign({}, state, {
        page_stats: null,
      });

    case 'PAGE_STATS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        page_stats: action.stats,
      });

    case 'LIGHTHOUSE_DETAILS_START':
      return Object.assign({}, state, {
        lighthouse_details: null,
      });

    case 'LIGHTHOUSE_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        lighthouse_details: action.details,
      });

    case 'UPTIME_DETAILS_START':
      return Object.assign({}, state, {
        uptime_details: null,
      });

    case 'UPTIME_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        uptime_details: action.details,
      });

    case 'ASSETS_DETAILS_START':
      return Object.assign({}, state, {
        assets_details: null,
      });

    case 'ASSETS_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        assets_details: action.details,
      });

    case 'PAGE_CREATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Page has been created', counter: state.message.counter + 1 },
        route: 'home',
      });

    case 'PAGE_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Page has been updated', counter: state.message.counter + 1 },
        page: action.page,
        route: `page/${action.page.id}`,
      });

    case 'PAGE_DELETE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Page has been deleted', counter: state.message.counter + 1 },
        page: action.page,
        route: 'home',
      });

    case 'BUDGETS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        budgets: action.budgets,
      });

    case 'BUDGETS_CREATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Budget has been added', counter: state.message.counter + 1 },
      });

    case 'BUDGETS_DELETE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Budget has been removed', counter: state.message.counter + 1 },
      });

    case 'PAGE_MEMBER_CREATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Member has been added', counter: state.message.counter + 1 },
      });

    case 'PAGE_MEMBER_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Member has been updated', counter: state.message.counter + 1 },
      });

    case 'PAGE_MEMBER_DELETE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Member has been removed', counter: state.message.counter + 1 },
      });

    case 'PAGE_OWNER_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        message: { text: 'Page ownership has been transfered', counter: state.message.counter + 1 },
      });


    case 'BUDGET_CREATE_ERROR':
    case 'BUDGET_DELETE_ERROR':
    case 'PAGE_MEMBER_CREATE_ERROR':
    case 'PAGE_MEMBER_UPDATE_ERROR':
    case 'PAGE_OWNER_UPDATE_ERROR':
    case 'PUSH_SUBSCRIPTION_ERROR':
    case 'PAGE_CREATE_ERROR':
    case 'PAGE_UPDATE_ERROR':
    case 'PAGE_DELETE_ERROR':
      if (action.errors) {
        return Object.assign({}, state, {
          errors: action.errors,
        });
      }
      if (action.message) {
        return Object.assign({}, state, {
          message: { text: action.message, counter: state.message.counter + 1 },
        });
      }
      return Object.assign({}, state, {
        message: { text: 'Unknown error.', counter: state.message.counter + 1 },
      });

    default:
      return state;
  }
};

export default app;
