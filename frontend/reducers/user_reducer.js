import merge from 'lodash/merge';
import {
  RECEIVE_CURRENT_USER,
} from '../actions/user_actions';

const initialState = {
  username: {
    code: {
      filename: undefined
    }
  }
};

const userReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_CURRENT_USER:
      newState = {
        [action.currentUser.username]: {
          code: action.currentUser.code
        }
      };

      return newState;
    default:
      return state;
  }
};

export default userReducer;
