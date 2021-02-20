import { combineReducers } from '@reduxjs/toolkit';
import accountReducer from './account/reducer';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import budgetsReducer from './budgets/reducer';
import membersReducer from './members/reducer';
import pagesReducer from './pages/reducer';
import statsReducer from './stats/reducer';

const rootReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  auth: authReducer,
  budgets: budgetsReducer,
  members: membersReducer,
  pages: pagesReducer,
  stats: statsReducer,
});

export default rootReducer;
