
import { addDays } from 'date-fns/esm';

// Initial state
const initial = {
  // Google analytics jey
  analyticsKey: null,

  // Push notification key
  pushKey: null,

  // Stripe public key
  stripeKey: null,

  // Text for message toast
  message: {
    text: '',
    counter: 0,
  },

  // Application route
  route: undefined,

  // Form validation errors
  errors: [],

  // Available stripe subscriptions plans
  subscriptionPlans: [],

  // Selected period
  period: { start: addDays(new Date(), -30).getTime(), end: new Date().getTime() },
};


const appReducer = (state = initial, action) => {
  // Process specific error returned by devise
  switch (action.type) {
    case 'FORGOT_PASSWORD_ERROR' :
    case 'SIGN_IN_ERROR' :
      return {...state, message: { text: action.payload.errors[0], counter: state.message.counter + 1 } };

    case 'SIGN_UP_ERROR' :
    case 'UPDATE_PASSWORD_ERROR' :
      return {...state, errors: action.payload.errors };
    }

  // Process all other error messages
  if (action.type.endsWith('_ERROR')) {
    if (action.payload) {
      return {...state, message: { text: action.payload.message, counter: state.message.counter + 1 }, errors: action.payload.errors };
    }
    else {
      return {...state, message: { text: 'Oops something went wrong.', counter: state.message.counter + 1 }, errors: [] };
    }
  }

  // Process specific messages
  switch (action.type) {
    case 'BUDGETS_CREATE_SUCCESS':
      return {...state, message: { text: 'Budget has been added', counter: state.message.counter + 1 } };

    case 'BUDGETS_DELETE_SUCCESS':
      return {...state, message: { text: 'Budget has been removed', counter: state.message.counter + 1 } };

    case 'ENVIRONMENT_FETCH_SUCCESS':
      return {...state,
        analyticsKey: action.payload.analyticsKey,
        pushKey: action.payload.pushKey,
        stripeKey: action.payload.stripeKey,
       };

    case 'FORGOT_PASSWORD_SUCCESS':
      return {...state, message: { text: action.payload, counter: state.message.counter + 1 } };

    case 'PAGE_CREATE_SUCCESS':
      return {...state,
        message: { text: 'Page has been created', counter: state.message.counter + 1 },
        route: '',
      };

    case 'PAGE_DELETE_SUCCESS':
      return {...state,
        message: { text: 'Page has been deleted', counter: state.message.counter + 1 },
        route: '',
      };

    case 'PAGE_MEMBER_CREATE_SUCCESS':
      return {...state, message: { text: 'Member has been added', counter: state.message.counter + 1 } };

    case 'PAGE_MEMBER_DELETE_SUCCESS':
      return {...state, message: { text: 'Member has been removed', counter: state.message.counter + 1 } };

    case 'PAGE_MEMBER_UPDATE_SUCCESS':
      return {...state, message: { text: 'Member has been updated', counter: state.message.counter + 1 } };

    case 'PAGE_OWNER_UPDATE_SUCCESS':
      return {...state, message: { text: 'Page ownership has been transfered', counter: state.message.counter + 1 } };

    case 'PAGE_UPDATE_SUCCESS':
      return {...state,
        message: { text: 'Page has been updated', counter: state.message.counter + 1 },
        route: `page/${action.payload.id}`,
      };

    case 'PERIOD_UPDATE':
      return {...state, period: action.payload};

    case 'PLANS_FETCH_SUCCESS':
      return {...state, subscriptionPlans: action.payload};

    case 'SHOW_INSTALL_PROMPT':
      return {...state, promptEvent: action.payload};

    case 'SIGN_IN_SUCCESS':
      return {...state, route: ''};

    case 'SIGN_OUT':
      return {...state, route: 'signin'};

    case 'SIGN_UP_SUCCESS':
      return {...state, message: { text: 'Sign up successful. An activation email has been sent to you.', counter: state.message.counter + 1 } };

    case 'STRIPE_SUBSCRIPTION_CREATE_SUCCESS':
      return {...state, message: { text: 'Your paid subscription has been created', counter: state.message.counter + 1 } };

    case 'STRIPE_SUBSCRIPTION_UPDATE_SUCCESS':
      return {...state, message: { text: 'Your paid subscription has been updated', counter: state.message.counter + 1 } };

    case 'STRIPE_SUBSCRIPTION_DELETE_SUCCESS':
      return {...state, message: { text: 'Your paid subscription has been deleted', counter: state.message.counter + 1 } };

    case 'UPDATE_MESSAGE':
      return {...state, message: { text: action.payload, counter: state.message.counter + 1 } };

    case 'UPDATE_PASSWORD_SUCCESS':
      return {...state,
        message: { text: action.payload, counter: state.message.counter + 1 },
        route: 'signin',
      };

    case 'UPDATE_ROUTE':
      return {...state, route: action.payload, errors: []};

    case 'USER_UPDATE_START':
      return {...state, errors: []};

    case 'USER_UPDATE_SUCCESS':
      return {...state,
        message: { text: 'Account informations have been updated', counter: state.message.counter + 1 },
        route: '',
      };

    default:
      return state;
  }
};

export default appReducer;
