import { getRequestUrl, getResource } from '../common';

// ***** Page members management

export const fetchPageMembersSuccess = members => ({
    type: 'PAGE_MEMBERS_FETCH_SUCCESS',
    members,
  });

export const fetchPageMembersError = errors => ({
  type: 'PAGE_MEMBERS_FETCH_ERROR',
  errors,
});

export const loadPageMembers = pageId => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members`, {}),
      method: 'GET',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(fetchPageMembersSuccess(response));
        } else {
          dispatch(fetchPageMembersError(response.errors));
        }
      },
    });
  });
};

export const createPageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_CREATE_SUCCESS',
  member,
});

export const createPageMemberError = message => ({
  type: 'PAGE_MEMBER_CREATE_ERROR',
  message,
});

export const createPageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members`, member),
      method: 'POST',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(createPageMemberSuccess(response));
        } else {
          dispatch(createPageMemberError(response.message));
        }
      },
    });
  });
};

export const updatePageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_UPDATE_SUCCESS',
  member,
});

export const updatePageMemberError = message => ({
  type: 'PAGE_MEMBER_UPDATE_ERROR',
  message,
});

export const updatePageMember = (pageId, member) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members/${member.id}`, member),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(updatePageMemberSuccess(response));
        } else {
          dispatch(updatePageMemberError(response.message));
        }
      },
    });
  });
};

export const deletePageMemberSuccess = member => ({
  type: 'PAGE_MEMBER_DELETE_SUCCESS',
  member,
});

export const deletePageMemberError = message => ({
  type: 'PAGE_MEMBER_DELETE_ERROR',
  message,
});

export const deletePageMember = (pageId, memberId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/members/${memberId}`, {}),
      method: 'DELETE',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(deletePageMemberSuccess(response));
        } else {
          dispatch(deletePageMemberError(response.message));
        }
      },
    });
  });
};

// ***** Page owner management

export const updatePageOwnerSuccess = owner => ({
  type: 'PAGE_OWNER_UPDATE_SUCCESS',
  owner,
});

export const updatePageOwnerError = message => ({
  type: 'PAGE_OWNER_UPDATE_ERROR',
  message,
});

export const updatePageOwner = (pageId, memberId) => (dispatch) => {
  dispatch((dispatch) => {
    getResource({
      url: getRequestUrl(`/pages/${pageId}/owner`, {member_id: memberId}),
      method: 'PUT',
      onLoad(e) {
        const response = JSON.parse(e.target.responseText);
        if (e.target.status === 200) {
          dispatch(loadPageMembers(pageId));
          dispatch(updatePageOwnerSuccess(response));
        } else {
          dispatch(updatePageOwnerError(response.message));
        }
      },
    });
  });

};
