
// Initial state
const initial = {
  // Loaded pages
  all: undefined,

  // Current page
  current: undefined,
};


const pagesReducer = (state = initial, action) => {
  switch (action.type) {
    case 'PAGES_FETCH_SUCCESS':
      return Object.assign({}, state, {
        all: action.payload,
      });

    case 'PAGE_FETCH_SUCCESS':
      return Object.assign({}, state, {
        current: action.payload,
      });

    case 'PAGE_UPDATE_SUCCESS':
      return Object.assign({}, state, {
        current: action.payload,
      });

    case 'PAGE_DELETE_SUCCESS':
      return Object.assign({}, state, {
        current: action.payload,
      });

    default:
      return state;
  }
};

export default pagesReducer;
