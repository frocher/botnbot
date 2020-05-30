
// Initial state
const initial = {
  user: undefined,
  stripeSubscription: undefined,
};


const accountReducer = (state = initial, action) => {
  switch (action.type) {
    case 'STRIPE_SUBSCRIPTION_DELETE_SUCCESS':
    case 'STRIPE_SUBSCRIPTION_FETCH_SUCCESS':
    case 'STRIPE_SUBSCRIPTION_UPDATE_SUCCESS':
      return { ...state, stripeSubscription: action.payload };

    case 'USER_FETCH_SUCCESS':
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export default accountReducer;
