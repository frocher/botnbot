import { getRequestUrl, getResource } from '../common';

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
