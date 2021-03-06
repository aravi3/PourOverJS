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

export const saveCode = (code) => dispatch => {
  return APIUtil.saveCode(code).then(
    resp => {
      if (resp.ok) {
        return resp.json().then(
          (codes) => {
            dispatch(receiveCode(codes));
            dispatch(clearErrors());
          }
        );
      } else {
        return resp.json().then(
          ({ customError }) => {
            dispatch(receiveErrors(customError));
          }
        );
      }
    }
  );
};

export const deleteCode = (filename) => dispatch => {
  return APIUtil.deleteCode(filename).then(
    resp => {
      if (resp.ok) {
        return resp.json().then(
          (codes) => {
            dispatch(receiveCode(codes));
            dispatch(clearErrors());
          }
        );
      } else {
        return resp.json().then(
          ({ customError }) => {
            dispatch(receiveErrors(customError));
          }
        );
      }
    }
  );
};
