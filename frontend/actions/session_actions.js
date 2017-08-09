import * as APIUtil from '../util/session_api_util';
import {
  receiveErrors,
  clearErrors
} from './error_actions';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

export const receiveCurrentUser = (currentUser) => {
  return {
    type: RECEIVE_CURRENT_USER,
    currentUser
  };
};

export const login = (user) => dispatch => {
  return APIUtil.login(user).then(
    resp => {
      if (resp.ok) {
        return resp.json();
      }
    },
    err => dispatch(receiveErrors(err))
  ).then(
    ({username}) => {
      dispatch(receiveCurrentUser({username}));
      dispatch(clearErrors());
  });
};

export const logout = () => dispatch => {
  return APIUtil.logout().then(
    resp => {
      if (resp.ok) {
        dispatch(receiveCurrentUser({ username: undefined, code: undefined }));
        dispatch(clearErrors());
      }
    },
    err => dispatch(receiveErrors(err))
  );
};

export const checkRefresh = () => dispatch => {
  return APIUtil.handleRefresh().then(
    resp => {
      if (resp.ok) {
        return resp.json();
      }
    }
  ).then(
    ({username}) => {
      dispatch(receiveCurrentUser({username}));
      dispatch(clearErrors());
  });
}
