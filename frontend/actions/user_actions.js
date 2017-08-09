import * as APIUtil from '../util/user_api_util';
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

export const signup = (user) => dispatch => {
  return APIUtil.signup(user).then(
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
