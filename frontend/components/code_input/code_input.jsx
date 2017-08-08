import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');

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
    let functionCallsCount = 0;

    let code = this.refs.ace.editor.getValue();
    let frame = document.getElementById('sandboxed');

    let ast = esprima.parse(code);
    ast.body.unshift(esprima.parse('let t0; let t1; let metrics = {}; t0 = performance.now();'));
    ast.body.push(esprima.parse('t1 = performance.now(); metrics.duration = t1 - t0;'));
    ast.body.push(esprima.parse('function performanceMetrics() { return metrics; }; performanceMetrics();'));

    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === "FunctionDeclaration") {
          functionCallsCount++;
          console.log("Function name: " + node.id.name);
        }
      }
    });

    console.log("Function calls count: " + functionCallsCount);

    let newCode = escodegen.generate(ast);
    console.log(newCode);

    frame.contentWindow.postMessage(newCode, '*');
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
