import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/dreamweaver';
import Modal from 'react-modal';
import { MERGE_SORT_EXAMPLE,
         CURRYING_EXAMPLE,
         DEBOUNCING_EXAMPLE } from '../../util/example_codes';
import CodeModal from './code_modal';
import SaveModal from './save_modal';

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
      variablesDeclared: [],
      showModal: false,
      saveModal: false,
      filename: ""
    };

    this.code = "";
    this.t0 = 0;
    this.t1 = 0;

    this.nextLine = this.nextLine.bind(this);
    this.runCode = this.runCode.bind(this);
    this.createsNewScope = this.createsNewScope.bind(this);
    this.printScope = this.printScope.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.populateEditor = this.populateEditor.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.updateCode = this.updateCode.bind(this);
    this.updateField = this.updateField.bind(this);

    window.addEventListener('message', (e) => {
      let frame = document.getElementById('sandboxed');
      if (e.origin === "null" && e.source === frame.contentWindow) {
        this.t1 = performance.now();
        let localExecutionTime = this.t1 - this.t0;
        this.setState({ executionTime: localExecutionTime, returnValue: e.data});

        let {
          functionCalls,
          inheritanceChain,
          executionTime,
          returnValue,
          variablesDeclared
        } = this.state;

        let localMetrics = {
          functionCalls,
          inheritanceChain,
          executionTime,
          returnValue,
          variablesDeclared
        };

        this.props.receiveMetrics(localMetrics);
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
    // Believe that ace editor is triggering a rerender under the hood
    this.code = this.refs.ace.editor.getValue();

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

  handleOpenModal(field) {
    return e => this.setState({ [field]: true });
  }

  handleCloseModal(field) {
    return e => this.setState({ [field]: false });
  }

  updateCode(e) {
    this.code = this.refs.ace.editor.getValue();
  }
  
  submitCode() {
    let codeObj = {
      filename: this.state.filename,
      code: this.code
    };
    this.props.saveCode(codeObj);
  }

  populateEditor(code, filename) {
    return e => {
      this.refs.ace.editor.setValue(`${code}`, -1);
      this.setState({filename: filename});
    };
  }

  updateField(field) {
    return(e) => this.setState({ [field]: e.target.value });
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
          onChange={ this.updateCode }
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
            <button className="next-line-button"
              onClick={this.nextLine}>Next Line
            </button>
            <button className="run-code-button"
              onClick={this.runCode}>Run>>
            </button>
            <button
              onClick={this.handleOpenModal('showModal')}>
              Modal
            </button>
            <button
              onClick={this.handleOpenModal('saveModal')}
              >
              Save
            </button>
          </div>

          <Modal
            isOpen={this.state.saveModal}
            onRequestClose={this.handleCloseModal('saveModal')}
            contentLabel="saveCode"
            shouldCloseOnOverlay={true}>
            <SaveModal
              submitCode={this.submitCode}
              filename={this.state.filename}
              updateField={this.updateField}
              handleCloseModal={this.handleCloseModal}
              />
          </Modal>

          <Modal
            isOpen={this.state.showModal}
            onRequestClose={ this.handleCloseModal('showModal')}
            contentLabel="userCode"
            shouldCloseOnOverlay={true}>
            <CodeModal
              code={this.props.code}
              populateEditor={this.populateEditor}
              handleCloseModal={this.handleCloseModal}
              />
          </Modal>

          <div className="bottom-buttons">
            <button className="merge-sort-button"
              onClick={this.populateEditor(MERGE_SORT_EXAMPLE)}>Merge Sort
            </button>
            <button className="curry-button"
              onClick={this.populateEditor(CURRYING_EXAMPLE)}>Curry Sum
            </button>
            <button className="debounce-button"
              onClick={this.populateEditor(DEBOUNCING_EXAMPLE)}>Debounce
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default CodeInput;
