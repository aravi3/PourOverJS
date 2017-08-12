import React from 'react';

class CodeModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(code, filename) {
    return e => {
      this.props.populateEditor(code, filename)();
      this.props.handleCloseModal('showModal')();
    };
  }

  render() {
    let allCode = this.props.code.map( (el, index) => {
      return (
        <li
          key={index}
          onClick={this.handleClick(el.code, el.filename)}>
          {el.filename}
        </li>
      );
    });

    return (
      <div>
        <ul>
          {allCode}
        </ul>
      </div>
    );
  }
}

export default CodeModal;
