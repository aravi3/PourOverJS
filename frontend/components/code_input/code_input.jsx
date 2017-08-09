import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.nextLine = this.nextLine.bind(this);
    this.runCode = this.runCode.bind(this);
    this.getReturnValue = this.getReturnValue.bind(this);
  }

  getReturnValue() {
    window.addEventListener('message', (e) => {
      let frame = document.getElementById('sandboxed');
      if (e.origin === "null" && e.source === frame.contentWindow) {
        console.log(e.data);
      }
    });
  }

  runCode() {
    this.getReturnValue();

    let timerId;
    let functionCallsCount = 0;
    let stack = [];

    let code = this.refs.ace.editor.getValue();
    let frame = document.getElementById('sandboxed');
    let ast = esprima.parse(code);

    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === "FunctionDeclaration") {
          functionCallsCount++;
          stack.push(node.id.name);
          console.log("Function name: " + node.id.name);
        }
      }
    });

    console.log("Function calls count: " + functionCallsCount);

    ast.body.unshift(esprima.parse('let t0; let t1; let metrics = {}; t0 = performance.now();'));
    ast.body.push(esprima.parse('t1 = performance.now(); metrics.duration = t1 - t0;'));
    ast.body.push(esprima.parse('function performanceMetrics() { return metrics; }; performanceMetrics();'));

    let newCode = escodegen.generate(ast);

    frame.contentWindow.postMessage(newCode, '*');

    timerId = setInterval(() => {
      if (stack.length === 1) {
        clearInterval(timerId);
      }

      console.log(stack.pop());
    }, 1000);
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
          <button className="run-code-button" onClick={this.runCode}>Run>></button>
        </div>
      </div>
    );
  }
}

export default CodeInput;
