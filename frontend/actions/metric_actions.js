export const RECEIVE_METRICS = 'RECEIVE_METRICS';

export const receiveMetrics = (metrics) => {
  return {
    type: RECEIVE_METRICS,
    metrics
  };
};
