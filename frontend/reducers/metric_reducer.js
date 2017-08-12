import merge from 'lodash/merge';
import {
  RECEIVE_METRICS,
  REMOVE_STACK_INDEX
} from '../actions/metric_actions';

const initialState = {
  functionCalls: undefined,
  closureChain: undefined,
  executionTime: undefined,
  returnValue: undefined,
  variablesDeclared: undefined,
  stack: undefined
};

const userReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;

  switch(action.type) {
    case RECEIVE_METRICS:
      newState = merge({}, state, action.metrics);
      return newState;
    case REMOVE_STACK_INDEX:
      newState = merge({}, state);
      newState.stack.splice(action.idx, 1);
      return newState;
    default:
      return state;
  }
};

export default userReducer;
