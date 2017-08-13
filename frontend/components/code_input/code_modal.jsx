import React from 'react';

class CodeModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick(code, filename) {
    return e => {
      this.props.populateEditor(code, filename)();
      this.props.handleCloseModal('showModal')();
      let deleteButton = document.getElementsByClassName("delete-code-button");
      deleteButton[0].classList.add("show-delete-button");
    };
  }

  handleDelete(filename) {
    return e => {
      e.stopPropagation();
      this.props.deleteCode(filename);
    }
  }

  render() {
    let allCode = this.props.code.map( (el, index) => {
      return (
        <li
          key={index}
          onClick={this.handleClick(el.code, el.filename)}>
          {el.filename}
          <button
            onClick={this.handleDelete(el.filename)}>
            DELETE
          </button>
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
