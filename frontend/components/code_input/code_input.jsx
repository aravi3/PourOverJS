import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
// import 'brace/theme/monokai';
let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');

class CodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.nextLine = this.nextLine.bind(this);
    this.runCode = this.runCode.bind(this);
    this.getReturnValue = this.getReturnValue.bind(this);
    this.createsNewScope = this.createsNewScope.bind(this);
    this.printScope = this.printScope.bind(this);
  }

  getReturnValue() {
    window.addEventListener('message', (e) => {
      let frame = document.getElementById('sandboxed');
      if (e.origin === "null" && e.source === frame.contentWindow) {
        console.log(e.data);
      }
    });
  }

  createsNewScope(node) {
    return node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'Program';
  }

  printScope(scope, parentArray, node) {
    let varsDisplay = scope.join(', ');

    if (node.type === 'Program') {
      console.log('Variables declared in the global scope:', varsDisplay);
    }
    else {
      if (node.id && node.id.name) {
        // console.log(parentArray);
        console.log('Variables declared in the function ' + node.id.name + '():', varsDisplay);
      }
      else {
        parentArray.unshift("anonymous");
        // console.log(parentArray);
        console.log('Variables declared in anonymous function:', varsDisplay);
      }
    }
  }

  runCode() {
    // Adds an event listener to capture the return value from the sandbox
    this.getReturnValue();
    let parentList = [];
    let parentScope;
    let parentObj = {};
    let parentArray = [];
    // let timerId;
    // Initialize counter for number of function calls in code
    let functionCallsCount = 0;
    // Initialize stack to empty array
    // let stack = [];
    let scopeChain = [];
    // let scopeChain = {};

    // Get the code from the editor when "Run" is clicked
    let code = this.refs.ace.editor.getValue();
    // Capture the sandbox element
    let frame = document.getElementById('sandboxed');
    // Generate abstract syntax tree from code snippet by using esprima module
    let ast = esprima.parse(code);
    // Console log the ast
    // console.log(ast);

    // The estraverse module traverses the AST in order (line by line)
    estraverse.traverse(ast, {
      // Whenever a node is entered, a callback is invoked that takes the node as
      // a parameter
      enter: (node, parent) => {
        // Console log the given node
        // If a function is invoked, do stuff
        if (node.type === "CallExpression") {
          // Increment the function calls counter
          functionCallsCount++;
          // Push into the stack the name of the function
          // stack.push(node.callee.name);
        }

        if (this.createsNewScope(node)) {
          scopeChain.push([]);
        }

        if (parent) {
          if (this.createsNewScope(parent)) {
            parentList.push([]);
          }

          if (parent.type === 'VariableDeclarator' || parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression') {
            parentScope = parentList[parentList.length - 1];

            if (parent.params) {
              let parameters = [];

              for (let i = 0; i < parent.params.length; i++) {
                parameters.push(parent.params[i].name);
              }

              parentScope.push(...parameters);
            }
          }
        }

        if (node.type === 'VariableDeclarator' || node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
          let currentScope = scopeChain[scopeChain.length - 1];

          if (node.params) {
            let parameters = [];

            for (let i = 0; i < node.params.length; i++) {
              parameters.push(node.params[i].name);
            }

            currentScope.push(...parameters);
          }

          if (node.type === 'VariableDeclarator' || parent.type === 'VariableDeclarator') {
            currentScope.push(node.id.name);
          }
        }
      },

      leave: (node, parent) => {
        if (this.createsNewScope(node)) {
          // if (parent) {
          //   if (this.createsNewScope(parent)) {
          //     console.log(parent.type);
          //     console.log(node.type);
          //   }
          // }

          if (node.id && node.id.name) {
            // parentObj[node.id.name] = parentScope;
            parentArray.push(node.id.name);
          }

          let currentScope = scopeChain.pop();
          // let currentScope = scopeChain[node.id.name];
          this.printScope(currentScope, parentArray, node);

          if (parent) {
            if (parent.type === 'Program') {
              console.log(parentArray);
              parentArray = [];
            }
          }
        }
      }
    });

    // console.log(parentArray);

    // Console log the number of function calls
    // console.log("Function calls count: " + functionCallsCount);

    // Add onto the beginning of the code snippet variables to capture execution time
    ast.body.unshift(esprima.parse('let t0; let t1; let metrics = {}; t0 = performance.now();'));
    // Add onto the end of the code snippet the captured duration and return the metrics object
    ast.body.push(esprima.parse('t1 = performance.now(); metrics.duration = t1 - t0;'));
    ast.body.push(esprima.parse('function performanceMetrics() { return metrics; }; performanceMetrics();'));

    // Convert the AST back into readable code
    let newCode = escodegen.generate(ast);

    // Console log the new readable code
    // console.log(newCode);

    // Run the code snippet within sandbox
    frame.contentWindow.postMessage(newCode, '*');

    // Iterate through the stack of function invocations and display them
    // to the console every second
    // timerId = setInterval(() => {
    //   if (stack.length === 1) {
    //     clearInterval(timerId);
    //   }
    //
    //   console.log(stack.pop());
    // }, 1000);
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
