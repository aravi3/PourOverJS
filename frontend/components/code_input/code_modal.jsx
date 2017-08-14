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
        <li className="code-modal-list-item"
          key={index}
          onClick={this.handleClick(el.code, el.filename)}>
          <span className="filename">
            {el.filename}
          </span>

          <button
            className="code-modal-delete-button"
            onClick={this.handleDelete(el.filename)}>
            DELETE
          </button>
        </li>
      );
    });

    return (
      <div className="code-modal-list-wrapper">
        <ul className="code-modal-list">
          {allCode}
        </ul>
      </div>
    );
  }
}

export default CodeModal;
