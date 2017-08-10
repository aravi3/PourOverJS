import { combineReducers } from 'redux';

import userReducer from './user_reducer';
import errorReducer from './error_reducer';
import metricReducer from './metric_reducer';

const RootReducer = combineReducers({
  users: userReducer,
  errors: errorReducer,
  metrics: metricReducer
});

export default RootReducer;
