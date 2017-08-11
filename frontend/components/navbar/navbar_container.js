import { connect } from 'react-redux';
import Navbar from './navbar';
import {
  login,
  logout,
  checkRefresh } from '../../actions/session_actions';
import { signup } from '../../actions/user_actions';

import {receiveErrors} from '../../actions/error_actions';

const mapStateToProps = (state) => {
  return {
    loggedIn: !!state.users.user.username
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login:  (user) => dispatch(login(user)),
    logout: () => dispatch(logout()),
    signup: (user) => dispatch(signup(user)),
    checkRefresh: () => dispatch(checkRefresh()),
    receiveErrors: (error) => dispatch(receiveErrors(error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
