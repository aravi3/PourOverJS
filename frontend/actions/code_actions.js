import * as APIUtil from '../util/code_api_util';
import {
  receiveErrors,
  clearErrors
} from './error_actions';

export const RECEIVE_CODE = 'RECEIVE_CODE';

export const receiveCode = (code) => {
  return {
    type: RECEIVE_CODE,
    code
  };
};

export const newCode = (code) => dispatch => {
  return APIUtil.newCode(code).then(
    resp => {
      if (resp.ok) {
        dispatch(receiveCode());
        dispatch(clearErrors());
      }
    },
    err => dispatch(receiveErrors(err))
  );
};

export const updateCode = (code) => dispatch => {
  return APIUtil.updateCode(code).then(
    resp => {
      if (resp.ok) {
        dispatch(receiveCode());
        dispatch(clearErrors());
      }
    },
    err => dispatch(receiveErrors(err))
  );
};

export const deleteCode = (filename) => dispatch => {
  return APIUtil.deleteCode(filename).then(
    resp => {
      if (resp.ok) {
        dispatch(receiveCode());
        dispatch(clearErrors());
      }
    },
    err => dispatch(receiveErrors(err))
  );
};
