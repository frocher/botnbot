// Initial state
const initial = {
  assets: undefined,
};

const reportsReducer = (state = initial, action) => {
  switch (action.type) {
    case 'REPORTS/ASSETS_FETCH_SUCCESS':
      return { ...state, assets: action.payload };

    default:
      return state;
  }
};

export default reportsReducer;
