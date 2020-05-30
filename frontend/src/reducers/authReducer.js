
import { fetchCredentials } from '../common';

// Initial state
const initial = {
  // User credentials for API
  credentials: fetchCredentials(),
};

const authReducer = (state = initial, action) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      sessionStorage.setItem('credentials', JSON.stringify(action.payload));
      return { ...state, credentials: action.payload };

    case 'SIGN_OUT':
      sessionStorage.removeItem('credentials');
      return { ...state, credentials: null };

    default:
      return state;
  }
};

export default authReducer;
