import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../../utilities/api';

// ***** Page budgets management

export const fetchBudgetsSuccess = createAction('BUDGETS_FETCH_SUCCESS');
export const fetchBudgetsError = createAction('BUDGETS_FETCH_ERROR');

export const loadBudgets = (pageId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/budgets`, {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchBudgetsSuccess(response));
      } else {
        dispatch(fetchBudgetsError(response));
      }
    },
  });
};

export const createBudgetSuccess = createAction('BUDGET_CREATE_SUCCESS');
export const createBudgetError = createAction('BUDGET_CREATE_ERROR');

export const createBudget = (pageId, category, item, budget) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/budgets`, { category, item, budget }),
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadBudgets(pageId));
        dispatch(createBudgetSuccess());
      } else {
        dispatch(createBudgetError(response));
      }
    },
  });
};

export const deleteBudgetSuccess = createAction('BUDGET_DELETE_SUCCESS');
export const deleteBudgetError = createAction('BUDGET_DELETE_ERROR');

export const deleteBudget = (pageId, budgetId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/budgets/${budgetId}`, {}),
    method: 'DELETE',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadBudgets(pageId));
        dispatch(deleteBudgetSuccess(response));
      } else {
        dispatch(deleteBudgetError(response));
      }
    },
  });
};
