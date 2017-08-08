import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: ""
    };

    this.setCode = this.setCode.bind(this);
    this.nextLine = this.nextLine.bind(this);
  }

  setCode(newVal) {
    let code = newVal;
    this.setState({ code });
  }

  nextLine() {
    let currentLine = this.refs.ace.editor.getCursorPosition().row + 1;
    currentLine += 1;
    this.refs.ace.editor.gotoLine(currentLine, 0);
  }

  render() {
    return (
      <div>
        <AceEditor
          mode="javascript"
          ref="ace"
          theme="monokai"
          onChange={this.setCode}
          name="code-input"
          value={this.state.code}
          editorProps={{$blockScrolling: true}}
        />

      <button onClick={this.nextLine}>Next Line</button>
      </div>
    );
  }
}

export default CodeInput;
