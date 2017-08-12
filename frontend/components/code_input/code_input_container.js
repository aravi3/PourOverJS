import { connect } from 'react-redux';
import CodeInput from './code_input';
import { receiveMetrics } from '../../actions/metric_actions';
import { saveCode,
         deleteCode } from '../../actions/code_actions';

const mapStateToProps = (state) => {
  return {
    code: state.users.code
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveMetrics: (metrics) => dispatch(receiveMetrics(metrics)),
    saveCode:  (code) => dispatch(saveCode(code)),
    deleteCode:  (filename) => dispatch(deleteCode(filename))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeInput);
