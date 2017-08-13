import { connect } from 'react-redux';
import Navbar from './navbar';
import {
  login,
  logout,
  checkRefresh } from '../../actions/session_actions';
import { signup } from '../../actions/user_actions';
import {
  receiveErrors,
  clearErrors
} from '../../actions/error_actions';

const mapStateToProps = (state) => {
  return {
    loggedIn: !!state.users.username,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login:  (user) => dispatch(login(user)),
    logout: () => dispatch(logout()),
    signup: (user) => dispatch(signup(user)),
    checkRefresh: () => dispatch(checkRefresh()),
    receiveErrors: (error) => dispatch(receiveErrors(error)),
    clearErrors: () => dispatch(clearErrors())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
