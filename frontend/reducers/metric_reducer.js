import merge from 'lodash/merge';
import {
  RECEIVE_METRICS,
} from '../actions/metric_actions';

const initialState = {
  functionCalls: undefined,
  inheritanceChain: undefined,
  executionTime: undefined,
  returnValue: undefined,
  variablesDeclared: undefined
};

const userReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;

  switch(action.type) {
    case RECEIVE_METRICS:
      newState = merge({}, state, action.metrics);
      return newState;
    default:
      return state;
  }
};

export default userReducer;
