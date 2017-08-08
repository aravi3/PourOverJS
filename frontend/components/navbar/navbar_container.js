import { connect } from 'react-redux';
import Navbar from './navbar';
import {
  login,
  logout } from '../../actions/session_actions';
import { signup } from '../../actions/user_actions';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login:  (user) => dispatch(login(user)),
    logout: () => dispatch(logout()),
    signup: (user) => dispatch(signup(user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
