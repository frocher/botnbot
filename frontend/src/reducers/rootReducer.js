import { combineReducers } from '@reduxjs/toolkit'
import accountReducer from './accountReducer';
import appReducer from './appReducer';
import authReducer from './authReducer';
import budgetsReducer from './budgetsReducer';
import membersReducer from './membersReducer';
import pagesReducer from './pagesReducer';
import statsReducer from './statsReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  auth: authReducer,
  budgets: budgetsReducer,
  members: membersReducer,
  pages: pagesReducer,
  stats: statsReducer,
});

export default rootReducer
