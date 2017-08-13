export const RECEIVE_METRICS = 'RECEIVE_METRICS';
export const REMOVE_STACK_INDEX = 'REMOVE_STACK_INDEX';
export const ADD_TO_CURRENT_STACK = 'ADD_TO_CURRENT_STACK';
export const REMOVE_FROM_CURRENT_STACK = 'REMOVE_FROM_CURRENT_STACK';
export const CLEAR_CURRENT_STACK = 'CLEAR_CURRENT_STACK';

export const receiveMetrics = (metrics) => {
  return {
    type: RECEIVE_METRICS,
    metrics
  };
};

export const removeStackIndex = (idx) => {
  return {
    type: REMOVE_STACK_INDEX,
    idx
  };
};

export const addToCurrentStack = (stack) => {
  return {
    type: ADD_TO_CURRENT_STACK,
    stack
  };
};

export const removeFromCurrentStack = () => {
  return {
    type: REMOVE_FROM_CURRENT_STACK
  };
};

export const clearCurrentStack = () => {
  return {
    type: CLEAR_CURRENT_STACK
  };
};
