import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.nextLine = this.nextLine.bind(this);
    this.runCode = this.runCode.bind(this);

    window.addEventListener('message',
    function (e) {
      let frame = document.getElementById('sandboxed');
      if (e.origin === "null" && e.source === frame.contentWindow) {
        console.log("Result: " + e.data);
      }
    });
  }

  runCode() {
    let code = this.refs.ace.editor.getValue();
    let frame = document.getElementById('sandboxed');
    frame.contentWindow.postMessage(code, '*');
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
        <button onClick={this.runCode}>Run Code</button>
      </div>
    );
  }
}

export default CodeInput;
