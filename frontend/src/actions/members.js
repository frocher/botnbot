import { createAction } from '@reduxjs/toolkit';
import { getRequestUrl, getResource } from '../common';

// ***** Page members management

export const fetchPageMembersSuccess = createAction('PAGE_MEMBERS_FETCH_SUCCESS');
export const fetchPageMembersError = createAction('PAGE_MEMBERS_FETCH_ERROR');

export const loadPageMembers = (pageId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/members`, {}),
    method: 'GET',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(fetchPageMembersSuccess(response));
      } else {
        dispatch(fetchPageMembersError(response));
      }
    },
  });
};

export const createPageMemberSuccess = createAction('PAGE_MEMBER_CREATE_SUCCESS');
export const createPageMemberError = createAction('PAGE_MEMBER_CREATE_ERROR');

export const createPageMember = (pageId, member) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/members`, member),
    method: 'POST',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadPageMembers(pageId));
        dispatch(createPageMemberSuccess(response));
      } else {
        dispatch(createPageMemberError(response));
      }
    },
  });
};

export const updatePageMemberSuccess = createAction('PAGE_MEMBER_UPDATE_SUCCESS');
export const updatePageMemberError = createAction('PAGE_MEMBER_UPDATE_ERROR');

export const updatePageMember = (pageId, member) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/members/${member.id}`, member),
    method: 'PUT',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadPageMembers(pageId));
        dispatch(updatePageMemberSuccess(response));
      } else {
        dispatch(updatePageMemberError(response));
      }
    },
  });
};

export const deletePageMemberSuccess = createAction('PAGE_MEMBER_DELETE_SUCCESS');
export const deletePageMemberError = createAction('PAGE_MEMBER_DELETE_ERROR');

export const deletePageMember = (pageId, memberId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/members/${memberId}`, {}),
    method: 'DELETE',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadPageMembers(pageId));
        dispatch(deletePageMemberSuccess(response));
      } else {
        dispatch(deletePageMemberError(response));
      }
    },
  });
};

// ***** Page owner management

export const updatePageOwnerSuccess = createAction('PAGE_OWNER_UPDATE_SUCCESS');
export const updatePageOwnerError = createAction('PAGE_OWNER_UPDATE_ERROR');

export const updatePageOwner = (pageId, memberId) => async (dispatch) => {
  getResource({
    url: getRequestUrl(`/pages/${pageId}/owner`, { member_id: memberId }),
    method: 'PUT',
    onLoad(e) {
      const response = JSON.parse(e.target.responseText);
      if (e.target.status === 200) {
        dispatch(loadPageMembers(pageId));
        dispatch(updatePageOwnerSuccess(response));
      } else {
        dispatch(updatePageOwnerError(response));
      }
    },
  });
};
