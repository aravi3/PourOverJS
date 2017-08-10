import { connect } from 'react-redux';
import CodeInput from './code_input';
import { receiveMetrics } from '../../actions/metric_actions';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveMetrics: (metrics) => dispatch(receiveMetrics(metrics))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeInput);
