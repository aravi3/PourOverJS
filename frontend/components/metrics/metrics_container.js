import { connect } from 'react-redux';
import Metrics from './metrics';

const mapStateToProps = (state) => {
  return {
    allMetrics: state.metrics
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Metrics);
  
