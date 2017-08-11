import React from 'react';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleSignup = this.handleSignup.bind(this);
  }

  update(field) {
    return (e) => this.setState({ [field]: e.target.value });
  }

  handleSignup(e) {
    e.preventDefault();

    if (this.state.username === "" && this.state.password === "") {
      this.props.receiveErrors("Username and password cannot be blank");
      return;
    } else if (this.state.username === "") {
      this.props.receiveErrors("Username cannot be blank");
      return;
    } else if (this.state.password === "") {
      this.props.receiveErrors("Password cannot be blank");
      return;
    } else if (this.state.password.length < 6) {
      this.props.receiveErrors("Password must be at least 6 characters");
      return;
    }

    let user = this.state;

    this.props.signup(user);
  }

  render() {

    return (
      <div className="signup-form-wrapper">
        <form id="signupForm">
          <input
            className="nav-signup-username-input"
            type="text"
            onChange={this.update("username")}
            placeholder="username"
            value={this.state.username}/>

          <input
            className="nav-signup-password-input"
            type="password"
            onChange={this.update("password")}
            placeholder="password"
            value={this.state.password}/>

          <button
            className="nav-signup-button"
            onClick={this.handleSignup}>
            Sign Up
          </button>
        </form>
      </div>
    )
  }
}

export default Signup;
