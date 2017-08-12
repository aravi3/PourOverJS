import { connect } from 'react-redux';
import CodeInput from './code_input';
import { reverseStack } from '../../reducers/selectors';
import {
  receiveMetrics,
  removeStackIndex } from '../../actions/metric_actions';
import { saveCode,
         deleteCode } from '../../actions/code_actions';

const mapStateToProps = (state) => {
  return {
    code: state.users.code,
    stack: state.metrics.stack
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeStackIndex: (idx) => dispatch(removeStackIndex(idx)),
    receiveMetrics: (metrics) => dispatch(receiveMetrics(metrics)),
    saveCode:  (code) => dispatch(saveCode(code)),
    deleteCode:  (filename) => dispatch(deleteCode(filename))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeInput);
