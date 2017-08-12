export const RECEIVE_METRICS = 'RECEIVE_METRICS';
export const REMOVE_STACK_INDEX = 'REMOVE_STACK_INDEX';

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
