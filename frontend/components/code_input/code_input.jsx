import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    // this.setCode = this.setCode.bind(this);
    this.nextLine = this.nextLine.bind(this);
  }

  nextLine() {
    let currentLineNumber = this.refs.ace.editor.getCursorPosition().row + 1;
    let currentLineText = this.refs.ace.editor.getValue().split("\n")[currentLineNumber];
    currentLineNumber += 1;
    this.refs.ace.editor.gotoLine(currentLineNumber, 0);

    console.log(currentLineText);
  }

  render() {
    return (
      <div>
        <AceEditor
          mode="javascript"
          ref="ace"
          theme="monokai"
          name="code-input"
          editorProps={{$blockScrolling: true}}
        />

      <button onClick={this.nextLine}>Next Line</button>
      </div>
    );
  }
}

export default CodeInput;
