
// Initial state
const initial = {
  all: [],
};

const budgetsReducer = (state = initial, action) => {
  switch (action.type) {
    case 'BUDGETS_FETCH_SUCCESS':
      return { ...state, all: action.payload };

    default:
      return state;
  }
};

export default budgetsReducer;
