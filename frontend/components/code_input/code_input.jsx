import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/dreamweaver';

let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      functionCalls: undefined,
      inheritanceChain: [],
      executionTime: undefined,
      returnValue: undefined,
      variablesDeclared: []
    };

    this.code = "";
    this.t0 = 0;
    this.t1 = 0;

    this.mergeCode = `//Write an Array#merge_sort method; it should not modify the original array.
  function mergeSort(array) {
    if (array.length <= 1) {
      return array;
    } else {
      const mid = Math.floor(array.length / 2);

      const left = mergeSort(array.slice(0, mid));
      const right = mergeSort(array.slice(mid));

      return merge(left, right);
    }
  }

  function merge(left, right) {

    const sorted = [];
    while (left.length > 0 && right.length > 0) {

      if (left[0] <= right[0]) {
        sorted.push(left.shift());
      } else if (right[0] < left[0]){
        sorted.push(right.shift());
      }
    }
    return sorted.concat(left, right);
  }

  console.log(mergeSort([1,9,2,3,0,5,6,6,43,24]));
  `

    this.nextLine = this.nextLine.bind(this);
    this.mergeSort = this.mergeSort.bind(this);
    this.runCode = this.runCode.bind(this);
    this.createsNewScope = this.createsNewScope.bind(this);
    this.printScope = this.printScope.bind(this);

    window.addEventListener('message', (e) => {
      let frame = document.getElementById('sandboxed');
      if (e.origin === "null" && e.source === frame.contentWindow) {
        this.t1 = performance.now();
        let executionTime = this.t1 - this.t0;
        this.setState({ executionTime, returnValue: e.data});
        this.props.receiveMetrics(this.state);
        this.setState({
          functionCalls: undefined,
          inheritanceChain: [],
          executionTime: undefined,
          returnValue: undefined,
          variablesDeclared: []
        });
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
      let newState = this.state.variablesDeclared;
      newState.push(`Variables declared in the global scope: ${varsDisplay}`);
    }
    else {
      if (node.id && node.id.name) {
        let newState = this.state.variablesDeclared;
        newState.push(`Variables declared in the function ${node.id.name}(): ${varsDisplay}`);
      }
      else {
        parentArray.unshift("anonymous");
        let newState = this.state.variablesDeclared;
        newState.push(`Variables declared in anonymous function: ${varsDisplay}`);
      }
    }
  }

  runCode() {
    let parentArray = [];
    // let timerId;
    // Initialize counter for number of function calls in code
    let functionCallsCount = 0;
    // Initialize stack to empty array
    // let stack = [];
    let scopeChain = [];

    // Get the code from the editor when "Run" is clicked
    this.code = this.refs.ace.editor.getValue();
    console.log(this.code);
    // Capture the sandbox element
    let frame = document.getElementById('sandboxed');
    // Generate abstract syntax tree from code snippet by using esprima module
    let ast = esprima.parse(this.code);
    // Console log the ast
    // console.log(ast);

    // The estraverse module traverses the AST in order (line by line)
    estraverse.traverse(ast, {
      // Whenever a node is entered, a callback is invoked that takes the node as
      // a parameter
      enter: (node) => {
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

          if (node.id && node.id.name) {
            parentArray.push(node.id.name);
          }

          let currentScope = scopeChain.pop();

          this.printScope(currentScope, parentArray, node);

          if (parent) {
            if (parent.type === 'Program') {
              console.log(parentArray);
              let newState = this.state.inheritanceChain;
              newState.push(parentArray);
              parentArray = [];
            }
          }
        }
      }
    });

    this.setState({ functionCalls: functionCallsCount });

    // Console log the number of function calls
    // console.log("Function calls count: " + functionCallsCount);

    // Add onto the beginning of the code snippet variables to capture execution time
    // ast.body.unshift(esprima.parse('t0 = performance.now();'));
    // ast.body.unshift(esprima.parse('let metrics = {}; let t0, t1;'));
    // Add onto the end of the code snippet the captured duration and return the metrics object
    // ast.body.push(esprima.parse('t1 = performance.now(); metrics.duration = t1 - t0;'));
    // ast.body.push(esprima.parse('function performanceMetrics() { return metrics; }; performanceMetrics();'));

    // Convert the AST back into readable code
    let newCode = escodegen.generate(ast);

    // Console log the new readable code
    // console.log(newCode);

    this.t0 = performance.now();
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

  mergeSort() {
    this.refs.ace.editor.setValue(`${this.mergeCode}`, -1)
  }


  render() {
    return (
      <div className="code-input-editor">
        <AceEditor
          className="code-box"
          mode="javascript"
          ref="ace"
          theme="dreamweaver"
          name="code-input"
          value={this.code}
          wrapEnabled={true}
          fontSize={14}
          editorProps={{
            $blockScrolling: "Infinity",
            $enableBasicAutocompletion: true,
            $enableLiveAutocompletion: true,
            $enableSnippets: true,
          }}
          setOptions={{

            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <div className="button-wrapper">
          <div className="top-buttons">
            <button className="next-line-button" onClick={this.nextLine}>Next Line</button>
            <button className="run-code-button" onClick={this.runCode}>Run>></button>
          </div>
          <div className="bottom-buttons">
            <button className="merge-sort-button" onClick={this.mergeSort}>Merge Sort</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CodeInput;
