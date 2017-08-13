import React from 'react';

class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.listener = "";
    this.listenerCB = (e) => {
      if (e.keyCode === 13) {
        setTimeout( () => {
          //Need to double invoke here to reuse handleCloseModal
          //for multiple modals
          this.props.handleCloseModal('saveModal')();
          this.props.submitCode();
        }, 0);
      }
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.listenerCB);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.listenerCB);
  }

  render() {
    return (
      <div className="save-modal-wrapper">
        <form className="save-modal-form">
          <input
            className="save-modal-input"
            onChange={this.props.updateField('filename')}
            placeholder="Enter a Filename"
            value={this.props.filename}
            autoFocus="autofocus"
            />
        </form>
      </div>
    );
  }
}

export default SaveModal;
