
// Initial state
const initial = {
  user: undefined,
  stripeSubscription: undefined,
};


const accountReducer = (state = initial, action) => {
  switch (action.type) {
    case 'USER_FETCH_SUCCESS':
      return Object.assign({}, state, {
        user: action.payload,
      });

    case 'STRIPE_SUBSCRIPTION_FETCH_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.payload,
      });

    case 'STRIPE_SUBSCRIPTION_CREATE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.payload,
      });

    case 'STRIPE_SUBSCRIPTION_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.payload,
      });

    case 'STRIPE_SUBSCRIPTION_DELETE_SUCCESS':
      return Object.assign({}, state, {
        stripeSubscription: action.payload,
      });


    default:
      return state;
  }
};

export default accountReducer;
