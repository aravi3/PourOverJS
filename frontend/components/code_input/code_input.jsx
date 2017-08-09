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
      <div className="code-input-editor">
        <AceEditor
          className="code-box"
          mode="javascript"
          ref="ace"
          theme="tomorrow"
          name="code-input"
          wrapEnabled={true}
          fontSize={14}
          editorProps={{
            $blockScrolling: true,
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <div className="button-wrapper">
          <button className="next-line-button" onClick={this.nextLine}>Next Line</button>
          <button className="run-code-button" onClick={this.runCode}>Run Code</button>
        </div>
      </div>
    );
  }
}

export default CodeInput;
