import { getRequestUrl, getResource } from '../common';

// ***** Pages management

export const fetchPagesSuccess = pages => ({
  type: 'PAGES_FETCH_SUCCESS',
  pages,
});

export const fetchPagesError = errors => ({
  type: 'PAGES_FETCH_ERROR',
  errors,
});

export const loadPages = () => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', { per_page: 9999 }),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPagesSuccess(response));
        } else {
          dispatch(fetchPagesError(response.errors));
        }
      },
    });
  });
};

export const fetchPageSuccess = page => ({
  type: 'PAGE_FETCH_SUCCESS',
  page,
});

export const fetchPageError = errors => ({
  type: 'PAGE_FETCH_ERROR',
  errors,
});

export const loadPage = id => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageSuccess(response));
        } else {
          dispatch(fetchPageError(response.errors));
        }
      },
    });
  });
};

export const createPageSuccess = () => ({
  type: 'PAGE_CREATE_SUCCESS',
});

export const createPageError = (message, errors) => ({
  type: 'PAGE_CREATE_ERROR',
  message,
  errors,
});

export const createPage = (name, url, device) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl('/pages', { name, url, device }),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(createPageSuccess());
        } else {
          dispatch(createPageError(response.message, response.errors));
        }
      },
    });
  });
};

export const updatePageSuccess = page => ({
  type: 'PAGE_UPDATE_SUCCESS',
  page,
});

export const updatePageError = errors => ({
  type: 'PAGE_UPDATE_ERROR',
  errors,
});

export const updatePage = (id, page) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, page),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(updatePageSuccess(response));
        } else {
          dispatch(updatePageError(response.errors));
        }
      },
    });
  });
};

export const deletePageSuccess = page => ({
  type: 'PAGE_DELETE_SUCCESS',
  page,
});

export const deletePageError = errors => ({
  type: 'PAGE_DELETE_ERROR',
  errors,
});

export const deletePage = id => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${id}`, {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(deletePageSuccess(response));
        } else {
          dispatch(deletePageError(response.errors));
        }
      },
    });
  });
};
