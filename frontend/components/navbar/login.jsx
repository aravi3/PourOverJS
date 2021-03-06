import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleLogin = this.handleLogin.bind(this);
  }

  update(field) {
    return (e) => this.setState({ [field]: e.target.value });
  }

  handleLogin(e) {
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
    }

    let user = this.state;

    this.props.login(user);
  }

  render() {
    let error = this.props.errors;

    return (
      <div className="login-form-wrapper">
        <form id="loginForm">
          <input
            className="nav-login-user-input"
            type="text"
            onChange={this.update("username")}
            placeholder="username"
            value={this.state.username}
            autoFocus/>

          <input
            className="nav-login-password-input"
            type="password"
            onChange={this.update("password")}
            placeholder="password"
            value={this.state.password}/>

          <button
            className="nav-login-button"
            onClick={this.handleLogin}>
            Log In
          </button>
        </form>

        <div>
          {error}
        </div>
      </div>
    )
  }
}

export default Login;
