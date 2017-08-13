import merge from 'lodash/merge';
import {
  RECEIVE_METRICS,
  REMOVE_STACK_INDEX,
  ADD_TO_CURRENT_STACK,
  REMOVE_FROM_CURRENT_STACK,
  CLEAR_CURRENT_STACK
} from '../actions/metric_actions';

const initialState = {
  functionCalls: undefined,
  closureChain: undefined,
  executionTime: undefined,
  returnValue: undefined,
  variablesDeclared: undefined,
  stack: undefined,
  currentStack: []
};

const userReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;

  switch(action.type) {
    case RECEIVE_METRICS:
      if (action.metrics.runCounter === 1) {
        newState = merge({}, initialState, action.metrics);
      }
      else {
        newState = merge({}, state, action.metrics);
      }
      delete newState.runCounter;
      return newState;
    case REMOVE_STACK_INDEX:
      newState = merge({}, state);
      newState.stack.splice(action.idx, 1);
      return newState;
    case ADD_TO_CURRENT_STACK:
      newState = merge({}, state);
      newState.currentStack.push(action.stack);
      return newState;
    case REMOVE_FROM_CURRENT_STACK:
      newState = merge({}, state);
      newState.currentStack.pop();
      return newState;
    case CLEAR_CURRENT_STACK:
      newState = merge({}, state);
      newState.currentStack = [];
      return newState;
    default:
      return state;
  }
};

export default userReducer;
