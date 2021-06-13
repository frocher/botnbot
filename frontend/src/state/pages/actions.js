import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../../utilities/api';

// ***** Pages management

export const fetchPagesSuccess = createAction('PAGES_FETCH_SUCCESS');
export const fetchPagesError = createAction('PAGES_FETCH_ERROR');

export const loadPages = () => async (dispatch) => {
  getResource({
    url: getRequestUrl('/pages', { per_page: 9999 }),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchPagesSuccess(response));
      } else {
        dispatch(fetchPagesError(response));
      }
    },
  });
};

export const fetchPageSuccess = createAction('PAGE_FETCH_SUCCESS');
export const fetchPageError = createAction('PAGE_FETCH_ERROR');

export const loadPage = (id) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${id}`, {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchPageSuccess(response));
      } else {
        dispatch(fetchPageError(response));
      }
    },
  });
};

export const createPageSuccess = createAction('PAGE_CREATE_SUCCESS');
export const createPageError = createAction('PAGE_CREATE_ERROR');

export const createPage = (name, url, description, device) => async (dispatch) => {
  getResource({
    url: getRequestUrl('/pages', {
      name, url, description, device,
    }),
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(createPageSuccess());
      } else {
        dispatch(createPageError(response));
      }
    },
  });
};

export const updatePageSuccess = createAction('PAGE_UPDATE_SUCCESS');
export const updatePageError = createAction('PAGE_UPDATE_ERROR');

export const updatePage = (id, page) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${id}`, page),
    method: 'PUT',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(updatePageSuccess(response));
      } else {
        dispatch(updatePageError(response));
      }
    },
  });
};

export const deletePageSuccess = createAction('PAGE_DELETE_SUCCESS');
export const deletePageError = createAction('PAGE_DELETE_ERROR');

export const deletePage = (id) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${id}`, {}),
    method: 'DELETE',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(deletePageSuccess(response));
      } else {
        dispatch(deletePageError(response));
      }
    },
  });
};
