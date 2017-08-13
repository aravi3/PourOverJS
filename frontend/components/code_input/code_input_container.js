import { connect } from 'react-redux';
import CodeInput from './code_input';
import { reverseStack } from '../../reducers/selectors';
import {
  receiveMetrics,
  removeStackIndex,
  addToCurrentStack,
  removeFromCurrentStack } from '../../actions/metric_actions';
import { saveCode,
         deleteCode } from '../../actions/code_actions';
import { login } from '../../actions/session_actions';
import {
 receiveErrors,
 clearErrors
} from '../../actions/error_actions';

const mapStateToProps = (state) => {
  return {
    loggedIn: !!state.users.username,
    code: state.users.code,
    stack: state.metrics.stack,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCurrentStack: (stack) => dispatch(addToCurrentStack(stack)),
    removeFromCurrentStack: () => dispatch(removeFromCurrentStack()),
    removeStackIndex: (idx) => dispatch(removeStackIndex(idx)),
    receiveMetrics: (metrics) => dispatch(receiveMetrics(metrics)),
    saveCode:  (code) => dispatch(saveCode(code)),
    deleteCode:  (filename) => dispatch(deleteCode(filename)),
    receiveErrors: (errors) => dispatch(receiveErrors(errors)),
    clearErrors: () => dispatch(clearErrors()),
    login:  (user) => dispatch(login(user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeInput);
