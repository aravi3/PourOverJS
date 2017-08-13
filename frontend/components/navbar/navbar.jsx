import React from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Modal from 'react-modal';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      activeModal: undefined,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.Navbae = this.Navbae.bind(this);
    this.getIn = this.getIn.bind(this);
    this.outPut = this.outPut.bind(this);
  }

  componentDidMount() {
    this.props.checkRefresh();
  }

  // componentWillReceiveProps(nextProps) {
  //   this.outPut();
  // }

  handleLogout(e) {
    e.preventDefault();
    this.props.logout();
    this.closeModal();
  }

  openModal(str) {
    this.setState({modalIsOpen: true, activeModal: str});
    this.props.clearErrors();
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false, activeModal: undefined});
    this.props.clearErrors();
  }

  outPut () {
    return (
      <div className="navbar-wrapper">
        <button
          className="logout-button"
          onClick={this.handleLogout}>
          Log Out
        </button>
      </div>
    );
  }

  getIn () {
    return (
      <div className="navbar-wrapper">

        <button
          className="navbar-login-button"
          onClick={ () => this.openModal('login') }>Log in</button>
        <button
          className="navbar-signup-button"
          onClick={ () => this.openModal('signup') }>Sign up</button>

        <Modal
          isOpen={this.state.activeModal === 'login'}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className={{
            base: 'modal',
            afterOpen: 'myClass_after-open',
            beforeClose: 'myClass_before-close'
          }}
          overlayClassName={{
            base: 'modal-overlay',
            afterOpen: 'myOverlayClass_after-open',
            beforeClose: 'myOverlayClass_before-close'
          }}>

          <Login
            login={this.props.login}
            errors={this.props.errors}
            receiveErrors={this.props.receiveErrors}/>
        </Modal>

        <Modal
          isOpen={this.state.activeModal === 'signup'}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className={{
            base: 'modal',
            afterOpen: 'myClass_after-open',
            beforeClose: 'myClass_before-close'
          }}
          overlayClassName={{
            base: 'modal-overlay',
            afterOpen: 'myOverlayClass_after-open',
            beforeClose: 'myOverlayClass_before-close'
          }}>

          <Signup
            signup={this.props.signup}
            errors={this.props.errors}
            receiveErrors={this.props.receiveErrors}/>
        </Modal>

      </div>
    );
  }

  Navbae () {
    if (this.props.loggedIn) {
      return this.outPut();
    }
    else
    {
      return this.getIn();
    }
  }

  render() {
      return this.Navbae();
  //   if (!this.props.loggedIn) {
  //     return (
  //       <div className="navbar-wrapper">
  //
  //         <button
  //           className="navbar-login-button"
  //           onClick={this.openModal}>Log in</button>
  //         <button
  //           className="navbar-signup-button"
  //           onClick={this.openModal}>Sign up</button>
  //         <Modal
  //           isOpen={this.state.modalIsOpen}
  //           onAfterOpen={this.afterOpenModal}
  //           onRequestClose={this.closeModal}
  //           contentLabel="Example Modal"
  //           className={{
  //             base: 'modal',
  //             afterOpen: 'myClass_after-open',
  //             beforeClose: 'myClass_before-close'
  //           }}
  //           overlayClassName={{
  //             base: 'modal-overlay',
  //             afterOpen: 'myOverlayClass_after-open',
  //             beforeClose: 'myOverlayClass_before-close'
  //           }}
  //           >
  //
  //           <Login
  //             login={this.props.login}/>
  //           <Signup
  //             signup={this.props.signup} />
  //         </Modal>
  //
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="navbar-wrapper">
  //         <button
  //           className="logout-button"
  //           onClick={this.handleLogout}>
  //           Log Out
  //         </button>
  //       </div>
  //     );
  //   }
  }
}

// export default Navbar;
export default Navbar;
