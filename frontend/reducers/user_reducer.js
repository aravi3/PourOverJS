import merge from 'lodash/merge';

import {
  RECEIVE_CURRENT_USER
} from '../actions/user_actions';

import {
  RECEIVE_CODE
} from '../actions/code_actions';

const initialState = {
    username: undefined,
    code: [],
    currentCode: null
};

const userReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_CURRENT_USER:
      newState = {
        username: action.currentUser.username,
        code: action.currentUser.code || [],
        currentCode: undefined
      };
      return newState;
    case RECEIVE_CODE:
      newState = merge({}, state);
      newState.code = action.code;
      return(newState);
    default:
      return state;
  }
};

export default userReducer;
