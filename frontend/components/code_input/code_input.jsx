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
import Login from '../navbar/login';

let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      functionCalls: undefined,
      closureChain: [],
      stack: [],
      executionTime: undefined,
      returnValue: undefined,
      variablesDeclared: [],
      showModal: false,
      saveModal: false,
      deleteModal: false,
      loginModal: false,
      filename: ""
    };

    this.code = "";
    this.functionDeclarations = "";
    this.runCounter = 0;
    this.t0 = 0;
    this.t1 = 0;

    this.nextLine = this.nextLine.bind(this);
    this.handleNext = this.nextLine();
    this.getReturnValue = this.getReturnValue.bind(this);
    this.runCode = this.runCode.bind(this);
    this.createsNewScope = this.createsNewScope.bind(this);
    this.printScope = this.printScope.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.populateEditor = this.populateEditor.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.updateCode = this.updateCode.bind(this);
    this.updateField = this.updateField.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  getReturnValue() {

    let callback = (e) => {
      let frame = document.getElementById('sandboxed');

      if (e.origin === "null" && e.source === frame.contentWindow) {
        this.t1 = performance.now();
        console.log(e.data);

        if (this.runCounter === 1) {
          console.log("Result: " + e.data);
          this.setState({ returnValue: e.data});
        }

        if (this.runCounter === 2) {
          let localExecutionTime = `${(this.t1 - this.t0).toFixed(2)} ms`;
          this.setState({ executionTime: localExecutionTime });
          this.setState({ functionCalls: e.data.stack.length });
          this.setState({ stack: e.data.stack });
          this.functionDeclarations = e.data.functionDeclarations;
        }

        let stateObj = {
          functionCalls: this.state.functionCalls,
          closureChain: this.state.closureChain,
          executionTime: this.state.executionTime,
          returnValue: this.state.returnValue,
          variablesDeclared: this.state.variablesDeclared,
          stack: this.state.stack,
          runCounter: this.runCounter
        };

        stateObj.variablesDeclared.shift();

        this.props.receiveMetrics(stateObj);

        window.removeEventListener('message', callback);

        if (this.runCounter < 2) {
          this.runCode();
        }
      }
    };

    window.addEventListener('message', callback);

    this.setState({
      functionCalls: undefined,
      closureChain: [],
      executionTime: undefined,
      returnValue: undefined,
      variablesDeclared: [],
      stack: []
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
        newState.push(`Variables declared in ${node.id.name}(): ${varsDisplay}`);
      }
      else {
        parentArray.unshift("anonymous");
        let newState = this.state.variablesDeclared;
        newState.push(`Variables declared in anonymous function: ${varsDisplay}`);
      }
    }
  }

  runCode() {
    this.refs.ace.editor.gotoLine(1, 0);

    if (this.runCounter === 2) {
      this.runCounter = 0;
    }

    this.runCounter++;

    this.getReturnValue();

    let parentArray = [];
    let callStackHelper = [];
    // let timerId;
    // Initialize counter for number of function calls in code
    // Initialize stack to empty array
    // let stack = [];
    let scopeChain = [];

    // Get the code from the editor when "Run" is clicked
    // Believe that ace editor is triggering a rerender under the hood
    this.code = this.refs.ace.editor.getValue();

    // console.log(this.code);

    // Capture the sandbox element
    let frame = document.getElementById('sandboxed');
    // Generate abstract syntax tree from code snippet by using esprima module
    // console.log(ast);
    // Console log the ast
    // console.log(ast);

    // The estraverse module traverses the AST in order (line by line)
    if (this.runCounter === 2) {
      let ast = esprima.parse(this.code, {loc: true});

      ast.body.unshift(esprima.parse('let metrics = {}; let stack = []; let stackAsync = []; let functionDeclarations = {};'));

      estraverse.traverse(ast, {
        // Whenever a node is entered, a callback is invoked that takes the node as
        // a parameter

        enter: (node, parent) => {
          if (node.type === "FunctionDeclaration" || (node.type === "FunctionExpression" && node.id === null)) {
            // parent.body.push(esprima.parse(`functionDeclarations['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
            if (node.id !== null) {
              callStackHelper.push(esprima.parse(`functionDeclarations['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
            }
            else {
              callStackHelper.push(esprima.parse(`functionDeclarations['anonymous'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
            }
          }

          if (node.type === "ExpressionStatement") {
            if (node.expression.type === "CallExpression" && node.expression.callee.name !== "retrieveStack") {
              if (node.expression.callee.name === "setTimeout") {
                parent.body.push(esprima.parse(`stackAsync.push(['setTimeout', ${node.expression.arguments[1].value}, ${node.loc.start.line}])`));
              }
              else {
                let level = node.expression.callee;
                while (level) {
                  // parent.body.push(esprima.parse(`stack.push(
                  //   ['${level.name ? level.name : level.property}',
                  //   ${node.loc.start.line}])`));

                  console.log("Index: " + parent.body.indexOf(node));

                  parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stack.push(
                    ['${level.name ? level.name : level.property}',
                    ${node.loc.start.line}])`));

                  if (level.callee) {
                    level = level.callee;
                  } else {
                    level = 0;
                  }
                }
              }
            }
          }
          else if (node.type === "ReturnStatement") {
            if (node.argument.type === "CallExpression") {
              let level = node.argument.callee;
              while (level) {
                // parent.body.push(esprima.parse(`stack.push(
                //   ['${level.name ? level.name : level.property}',
                //   ${node.loc.start.line}])`));

                console.log("Index: " + parent.body.indexOf(node));

                parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stack.push(
                  ['${level.name ? level.name : level.property}',
                  ${node.loc.start.line}])`));

                if (level.callee) {
                  level = level.callee;
                } else {
                  level = 0;
                }
              }
            }
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
                let newState = this.state.closureChain;

                if (parentArray.length !== 0) {
                  newState.push(parentArray);
                }

                parentArray = [];
              }
            }
          }
        }
      });

      for (let i = 0; i < callStackHelper.length; i++) {
        ast.body.push(callStackHelper[i]);
      }

      ast.body.push(esprima.parse('metrics.stack = stack; metrics.stackAsync = stackAsync; metrics.functionDeclarations = functionDeclarations; function retrieveMetrics() { return metrics; } retrieveMetrics();'));

      console.log(ast);

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
      console.log(newCode);

      this.t0 = performance.now();
      frame.contentWindow.postMessage(newCode, '*');
    }
    else {
      this.t0 = performance.now();
      frame.contentWindow.postMessage(this.code, '*');
    }
    // Console log the new readable code
    // console.log(newCode);

    // Run the code snippet within sandbox

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


  // nextLine() {
  //   let currentLineNumber = this.refs.ace.editor.getCursorPosition().row + 1;
  //   let currentLineText = this.refs.ace.editor.getValue().split("\n")[currentLineNumber];
  //   currentLineNumber += 1;
  //   this.refs.ace.editor.gotoLine(currentLineNumber, 0);
  //   console.log(currentLineText);
  // }

  handleOpenModal(field) {
    return e => {
      if((field === "saveModal" || field === "showModal") && !this.props.loggedIn) {
        this.setState({ loginModal: true });
      } else {
        this.setState({ [field]: true })
      }
    };
  }

  handleCloseModal(field) {
    return e => {
      this.props.clearErrors();
      this.setState({ [field]: false });
    }
  }

  updateCode(e) {
    this.code = this.refs.ace.editor.getValue();
  }

  nextLine() {
    // let currentLineNumber = this.refs.ace.editor.getCursorPosition().row + 1;
    // let currentLineText = this.refs.ace.editor.getValue().split("\n")[currentLineNumber];
    // currentLineNumber += 1;
    // this.refs.ace.editor.gotoLine(currentLineNumber, 0);
    let idx = 0;
    let stackFlag;
    let endFlag = false;

    return () => {
      console.log(this.props.stack);
      if (!endFlag) {
        this.refs.ace.editor.gotoLine(this.props.stack[idx][1], 0);
      }

      if (this.props.stack.length === 0) {
        idx = 0;
        return;
      }

      if (stackFlag) {
        this.props.removeFromCurrentStack();
        stackFlag = false;
      }

      if (this.props.stack[idx + 1] === undefined) {
        if (!endFlag) {
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          stackFlag = true;
        }

        endFlag = true;
        this.props.removeStackIndex(idx);
        idx--;
        return;
      }

      if (this.functionDeclarations[this.props.stack[idx][0]]) {
        if ((this.props.stack[idx + 1][1] >= this.functionDeclarations[this.props.stack[idx][0]][0]) && (this.props.stack[idx + 1][1] <= this.functionDeclarations[this.props.stack[idx][0]][1])) {
          console.log("Passed");
          console.log("Before idx: " + idx);
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          idx++;
          console.log("After idx: " + idx);
        }
        else {
          console.log("Before idx: " + idx);
          stackFlag = true;
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          this.props.removeStackIndex(idx);
          // idx++;
          console.log("After idx: " + idx);
          // dispatch something to take current idx off stack and do not increment idx
        }
      }
      else {
        this.props.addToCurrentStack(this.props.stack[idx][0]);
        stackFlag = true;
        console.log("Before idx: " + idx);
        this.props.removeStackIndex(idx);
        console.log("After idx: " + idx);
      }
    };
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

  handleDelete() {
    this.props.deleteCode(this.state.filename);
    this.populateEditor("", "")();
    let deleteButton = document.getElementsByClassName("delete-code-button");
    deleteButton[0].classList.remove("show-delete-button");
    this.handleCloseModal('deleteModal')();
  }

  render() {
    if(this.state.loginModal && this.props.loggedIn) {
      this.state.loginModal = false;
    }

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
          }}/>
        <div className="button-wrapper">
          <div className="top-buttons">

            <button className="run-code-button"
              onClick={this.runCode}>Run>>
            </button>

            <button className="next-line-button"
              onClick={this.handleNext}>Next Line
            </button>

            <button
              className="save-modal-button"
              onClick={this.handleOpenModal('saveModal')}>
              Save Code
            </button>

            <button
              className="delete-code-button"
              onClick={this.handleOpenModal('deleteModal')}>
              Delete
            </button>
          </div>

          <Modal
            isOpen={this.state.saveModal}
            onRequestClose={this.handleCloseModal('saveModal')}
            contentLabel="saveCode"
            shouldCloseOnOverlay={true}
            className={{
              base: 'save-modal',
              afterOpen: 'save-modal-after-open',
              beforeClose: 'save-modal-before-close'
            }}
            overlayClassName={{
              base: 'save-modal-overlay',
              afterOpen: 'save-modal-over-after-open',
              beforeClose: 'save-modal-over-before-close'
            }}>
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
            shouldCloseOnOverlay={true}
            className={{
              base: 'code-modal',
              afterOpen: 'code-modal-after-open',
              beforeClose: 'code-modal-before-close'
            }}
            overlayClassName={{
              base: 'code-modal-overlay',
              afterOpen: 'code-modal-over-after-open',
              beforeClose: 'code-modal-over-before-close'
            }}>
            <CodeModal
              code={this.props.code}
              populateEditor={this.populateEditor}
              handleCloseModal={this.handleCloseModal}
              deleteCode={this.props.deleteCode}
              />
          </Modal>

          <Modal
            isOpen={this.state.deleteModal}
            onRequestClose={ this.handleCloseModal('deleteModal')}
            contentLabel="deleteCode"
            shouldCloseOnOverlay={true}>
            <div>
              <button
                onClick={this.handleCloseModal('deleteModal')}>
                Cancel
              </button>

              <button
                onClick={this.handleDelete}>
                Delete
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.loginModal}
            onRequestClose={ this.handleCloseModal('loginModal')}
            contentLabel="login"
            shouldCloseOnOverlay={true}
            className={{
              base: 'login-failsafe-modal',
              afterOpen: 'login-failsafe-modal-after-open',
              beforeClose: 'login-failsafe-modal-before-close'
            }}
            overlayClassName={{
              base: 'login-failsafe-modal-overlay',
              afterOpen: 'login-failsafe-modal-over-after-open',
              beforeClose: 'login-failsafe-modal-over-before-close'
            }}>
            <Login
              login={this.props.login}
              errors={this.props.errors}
              receiveErrors={this.props.receiveErrors}/>
          </Modal>

          <div className="bottom-buttons">
            <button className="code-modal-button"
              onClick={this.handleOpenModal('showModal')}>
              My Scripts
            </button>
            <button className="merge-sort-button"
              onClick={this.populateEditor(MERGE_SORT_EXAMPLE, "")}>Merge Sort
            </button>
            <button className="curry-button"
              onClick={this.populateEditor(CURRYING_EXAMPLE, "")}>Curry Sum
            </button>
            <button className="debounce-button"
              onClick={this.populateEditor(DEBOUNCING_EXAMPLE, "")}>Debounce
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default CodeInput;
