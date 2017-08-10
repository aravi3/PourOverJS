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

    let user = this.state;

    this.props.signup(user);
  }

  render() {
    return (
      <div>
        <form id="signupForm">
          <input
            type="text"
            onChange={this.update("username")}
            placeholder="username"
            value={this.state.username}/>

          <input
            type="text"
            onChange={this.update("password")}
            placeholder="password"
            value={this.state.password}/>

          <button
            onClick={this.handleSignup}>
            Sign Up
          </button>
        </form>
      </div>
    )
  }
}

export default Signup;
