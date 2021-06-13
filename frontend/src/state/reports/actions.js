import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../../utilities/api';

export const fetchAssetsSuccess = createAction('REPORTS/ASSETS_FETCH_SUCCESS');
export const fetchAssetsError = createAction('REPORTS/ASSETS_FETCH_ERROR');

export const loadAssets = (pageId, assetsId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/assets/${assetsId}`, {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchAssetsSuccess(response));
      } else {
        dispatch(fetchAssetsError(response));
      }
    },
  });
};
