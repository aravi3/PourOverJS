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
    currentUser => {
      dispatch(receiveCurrentUser(currentUser));
      dispatch(clearErrors());
    },
    err => dispatch(receiveErrors(err))
  );
};

export const logout = () => dispatch => {
  return APIUtil.logout().then(
    currentUser => {
      dispatch(receiveCurrentUser({ username: undefined, code: undefined }));
      dispatch(clearErrors());
    },
    err => dispatch(receiveErrors(err))
  );
};
