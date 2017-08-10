import React from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import Signup from './signup';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.props.checkRefresh();
  }

  handleLogout(e) {
    e.preventDefault();

    this.props.logout();
  }

  render() {
    return (
      <div>
        <Login
          login={this.props.login}/>

        <Signup
          signup={this.props.signup} />

        <button
          onClick={this.handleLogout}>
          Log Out
        </button>
      </div>
    );
  }
}

export default Navbar;
