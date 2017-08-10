import React from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Modal from 'react-modal';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.props.checkRefresh();
  }

  handleLogout(e) {
    e.preventDefault();

    this.props.logout();
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div className="navbar-wrapper">
        <button onClick={this.openModal}>Log in</button>
        <button onClick={this.openModal}>Sign up</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
        <Login
          login={this.props.login}/>
        <Signup
          signup={this.props.signup} />

        </Modal>

        <button
          className="logout-button"
          onClick={this.handleLogout}>
          Log Out
        </button>
      </div>
    );
  }
}

export default Navbar;
