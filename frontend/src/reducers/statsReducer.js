
// Initial state
const initial = {
  // Statistics of current page
  all: undefined,

  // Lighthouse details of current page
  lighthouse_details: undefined,

  // Uptime details of current page
  uptime_details: undefined,

  // Assets details of current page
  assets_details: undefined,
};


const statsReducer = (state = initial, action) => {
  switch (action.type) {
    case 'PAGE_STATS_START':
      return Object.assign({}, state, {
        all: null,
      });

    case 'PAGE_STATS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        all: action.payload,
      });

    case 'LIGHTHOUSE_DETAILS_START':
      return Object.assign({}, state, {
        lighthouse_details: null,
      });

    case 'LIGHTHOUSE_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        lighthouse_details: action.payload,
      });

    case 'UPTIME_DETAILS_START':
      return Object.assign({}, state, {
        uptime_details: null,
      });

    case 'UPTIME_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        uptime_details: action.payload,
      });

    case 'ASSETS_DETAILS_START':
      return Object.assign({}, state, {
        assets_details: null,
      });

    case 'ASSETS_DETAILS_FETCH_SUCCESS':
      return Object.assign({}, state, {
        assets_details: action.payload,
      });

    default:
      return state;
  }
};

export default statsReducer;
