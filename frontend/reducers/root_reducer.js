import { combineReducers } from 'redux';

import userReducer from './user_reducer';
import errorReducer from './error_reducer';

const RootReducer = combineReducers({
  users: userReducer,
  errors: errorReducer
});

export default RootReducer;
