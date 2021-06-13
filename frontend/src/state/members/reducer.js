// Initial state
const initial = {
  all: [],
};

const membersReducer = (state = initial, action) => {
  switch (action.type) {
    case 'PAGE_MEMBERS_FETCH_SUCCESS':
      return { ...state, all: action.payload };

    default:
      return state;
  }
};

export default membersReducer;
