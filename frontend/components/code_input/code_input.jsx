import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/dreamweaver';
import Modal from 'react-modal';
import { MERGE_SORT_EXAMPLE,
         BFS_EXAMPLE,
         QUICK_SORT_EXAMPLE } from '../../util/example_codes';
import CodeModal from './code_modal';
import SaveModal from './save_modal';
import Login from '../navbar/login';

let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');
// let regenerator = require('regenerator');

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
    this.determineFunctionDeclaration = this.determineFunctionDeclaration.bind(this);
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

        if (this.runCounter === 1) {
          this.setState({ returnValue: e.data});
        }

        if (this.runCounter === 2) {
          let returnedStack = e.data.stack;
          let hashCounter = {
            lineNumber: null,
            counter: 0
          };
          let linesToProcess = [];
          let localExecutionTime = `${(this.t1 - this.t0).toFixed(2)} ms`;

          this.setState({ executionTime: localExecutionTime });
          this.setState({ functionCalls: returnedStack.length });

          returnedStack.forEach( el => {
            if(el[1] === hashCounter.lineNumber) {
              hashCounter.counter ++;
            } else {
              if(hashCounter.counter > 1) {
                linesToProcess.push([hashCounter.lineNumber, hashCounter.counter]);
              }
              hashCounter.lineNumber = el[1];
              hashCounter.counter = 1;
            }
          });

          linesToProcess.forEach(el => {
            let idx, nodesToReverse, reversedNodes;

            idx = returnedStack.findIndex(el2 => {
              return el2[1] === el[0];
            });

            if (idx > -1) {
              nodesToReverse = returnedStack.splice(idx, el[1]);
              reversedNodes = nodesToReverse.reverse();

              reversedNodes.forEach((el3, idx3) => {
                if (el3[0] === "undefined") {
                  reversedNodes[idx3][0] = "innerExpression";
                }
              });

              returnedStack.splice(idx, 0, ...reversedNodes);
            }
          });

          this.setState({ stack: returnedStack });
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
        // parentArray.unshift("anonymous");
        let newState = this.state.variablesDeclared;
        newState.push(`Variables declared in anonymous function: ${varsDisplay}`);
      }
    }
  }

  determineFunctionDeclaration(node, arr) {
    if (node.type === "FunctionDeclaration" || (node.type === "FunctionExpression" && node.id === null)) {
      // parent.body.push(esprima.parse(`functionDeclarations['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
      if (node.id !== null) {
        arr.push(esprima.parse(`functionDeclarationsPourOver['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
      }
      else {
        arr.push(esprima.parse(`functionDeclarationsPourOver['anonymous'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
      }
    }
  }

  runCode() {
    this.refs.ace.editor.gotoLine(1, 0);
    this.handleNext = this.nextLine();

    if (this.runCounter === 2) {
      this.runCounter = 0;
    }

    this.runCounter++;

    this.getReturnValue();

    let parentArray = [];
    let callStackHelper = [];
    let scopeChain = [];

    // Get the code from the editor when "Run" is clicked
    // Believe that ace editor is triggering a rerender under the hood
    this.code = this.refs.ace.editor.getValue();
    // let tempCode = regenerator.compile(this.code).code;
    // console.log(tempCode);
    // console.log(this.code);

    // Capture the sandbox element
    let frame = document.getElementById('sandboxed');
    // Generate abstract syntax tree from code snippet by using esprima module
    // console.log(ast);

    // The estraverse module traverses the AST in order (line by line)
    if (this.runCounter === 2) {
      let ast = esprima.parse(this.code, {loc: true});

      ast.body.unshift(esprima.parse('let metricsPourOver = {}; let stackPourOver = []; let stackAsyncPourOver = []; let functionDeclarationsPourOver = {};'));

      estraverse.traverse(ast, {
        // Whenever a node is entered, a callback is invoked that takes the node as
        // a parameter

        enter: (node, parent) => {
          let level;
          let callArguments;

          if (parent) {
            if (parent.type !== "VariableDeclarator" && parent.type !== "AssignmentExpression") {
              this.determineFunctionDeclaration(node, callStackHelper);
            }
          }

          if (node.type === "ExpressionStatement") {
            if (node.expression.type === "CallExpression" && node.expression.callee.name !== "retrieveStack") {
              // if (node.expression.callee.name === "setTimeout") {
              //   parent.body.push(esprima.parse(`stackAsyncPourOver.push(['setTimeout', ${node.expression.arguments[1].value}, ${node.loc.start.line}])`));
              // }
              level = node.expression.callee;
              callArguments = node.expression.arguments;
            }
            else if (node.expression.type === "AssignmentExpression") {
              if (node.expression.right.callee) {
                // if (node.expression.right.callee.name === "setTimeout") {
                //   parent.body.push(esprima.parse(`stackAsyncPourOver.push(['setTimeout', ${node.expression.right.arguments[1].value}, ${node.loc.start.line}])`));
                // }
                level = node.expression.right.callee;
                callArguments = node.expression.right.arguments;
              }
              // else if (node.expression.right.type === "FunctionDeclaration" || (node.expression.right.type === "FunctionExpression" && node.expression.right.id === null)) {
              //   // parent.body.push(esprima.parse(`functionDeclarations['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
              //   if (node.left.name !== null) {
              //     callStackHelper.push(esprima.parse(`functionDeclarationsPourOver['${node.left.name}'] = [${node.expression.right.loc.start.line}, ${node.expression.right.loc.end.line}]`));
              //   }
              //   else {
              //     callStackHelper.push(esprima.parse(`functionDeclarationsPourOver['anonymous'] = [${node.expression.right.loc.start.line}, ${node.expression.right.loc.end.line}]`));
              //   }
              // }
            }
          }
          else if (node.type === "ReturnStatement") {
            if (node.argument.type === "CallExpression") {
              // if (node.argument.callee.name === "setTimeout") {
              //   parent.body.push(esprima.parse(`stackAsyncPourOver.push(['setTimeout', ${node.argument.arguments[1].value}, ${node.loc.start.line}])`));
              // }
              level = node.argument.callee;
              callArguments = node.argument.arguments;
            }
          }
          else if (node.type === "VariableDeclaration") {
            if (node.declarations[0].init) {
              if (node.declarations[0].init.type === "CallExpression") {
                // if (node.declarations[0].init.callee.name === "setTimeout") {
                //   parent.body.push(esprima.parse(`stackAsyncPourOver.push(['setTimeout', ${node.declarations[0].init.arguments[1].value}, ${node.loc.start.line}])`));
                // }
                level = node.declarations[0].init.callee;
                callArguments = node.declarations[0].init.arguments;
              }
              else if (node.declarations[0].init.type === "FunctionDeclaration" || (node.declarations[0].init.type === "FunctionExpression" && node.declarations[0].init.id === null)) {
                // parent.body.push(esprima.parse(`functionDeclarations['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`));
                if (node.declarations[0].id.name !== null) {
                  callStackHelper.push(esprima.parse(`functionDeclarationsPourOver['${node.declarations[0].id.name}'] = [${node.declarations[0].init.loc.start.line}, ${node.declarations[0].init.loc.end.line}]`));
                }
                else {
                  callStackHelper.push(esprima.parse(`functionDeclarationsPourOver['anonymous'] = [${node.declarations[0].init.loc.start.line}, ${node.declarations[0].init.loc.end.line}]`));
                }
              }
            }
          }

          while (level) {
            parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stackPourOver.push(
              ['${level.name ? level.name : (level.property ? level.property.name : level.property)}',
              ${node.loc.start.line}])`));

            if (level.callee) {
              level = level.callee;
            } else {
              level = 0;
            }
          }

          if (callArguments && callArguments.length > 0) {
            for (let i = 0; i < callArguments.length; i++) {
              let argumentLevel = callArguments[i].callee;

              while (argumentLevel) {
                parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stackPourOver.push(
                  ['${argumentLevel.name ? argumentLevel.name : (argumentLevel.property ? argumentLevel.property.name : argumentLevel.property)}',
                  ${node.loc.start.line}])`));

                if (argumentLevel.callee) {
                  argumentLevel = argumentLevel.callee;
                } else {
                  argumentLevel = 0;
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

            if (node.type === 'VariableDeclarator') {
              if (node.id) {
                currentScope.push(node.id.name);
              }
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

      ast.body.push(esprima.parse('metricsPourOver.stack = stackPourOver; metricsPourOver.stackAsync = stackAsyncPourOver; metricsPourOver.functionDeclarations = functionDeclarationsPourOver; function retrieveMetricsPourOver() { return metricsPourOver; } retrieveMetricsPourOver();'));

      // Convert the AST back into readable code
      let newCode = escodegen.generate(ast);
      // console.log(newCode);

      this.t0 = performance.now();
      frame.contentWindow.postMessage(newCode, '*');
    }
    else {
      this.t0 = performance.now();
      frame.contentWindow.postMessage(this.code, '*');
    }
  }

  handleOpenModal(field) {
    return e => {
      if((field === "saveModal" || field === "showModal") && !this.props.loggedIn) {
        this.setState({ loginModal: true });
      } else {
        this.setState({ [field]: true });
      }
    };
  }

  handleCloseModal(field) {
    return e => {
      this.props.clearErrors();
      this.setState({ [field]: false });
    };
  }

  updateCode(e) {
    this.code = this.refs.ace.editor.getValue();
  }

  nextLine() {
    let idx = 0;
    let stackFlag = false;
    let endFlag = false;

    return () => {
      if (stackFlag) {
        this.props.removeFromCurrentStack();
        stackFlag = false;
        return;
      }

      if (!endFlag) {
        this.refs.ace.editor.gotoLine(this.props.stack[idx][1], 0);
      }

      if (this.props.stack.length === 0) {
        idx = 0;
        this.props.clearCurrentStack();
        return;
      }

      if (this.props.stack[idx + 1] === undefined) {
        if (!endFlag) {
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          stackFlag = true;
        }

        endFlag = true;
        stackFlag = true;
        this.props.removeStackIndex(idx);
        idx--;
        return;
      }

      if (this.functionDeclarations[this.props.stack[idx][0]]) {
        if ((this.props.stack[idx + 1][1] >= this.functionDeclarations[this.props.stack[idx][0]][0]) && (this.props.stack[idx + 1][1] <= this.functionDeclarations[this.props.stack[idx][0]][1])) {
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          idx++;
        }
        else {
          stackFlag = true;
          this.props.addToCurrentStack(this.props.stack[idx][0]);
          this.props.removeStackIndex(idx);
        }
      }
      else {
        this.props.addToCurrentStack(this.props.stack[idx][0]);
        stackFlag = true;
        this.props.removeStackIndex(idx);
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
            <div className="cancel-delete-wrapper">
              <button
                className="code-modal-delete-button"
                onClick={this.handleCloseModal('deleteModal')}>
                Cancel
              </button>

              <button
                className="code-modal-delete-button"
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
              onClick={this.populateEditor(BFS_EXAMPLE, "")}>BFS
            </button>
            <button className="debounce-button"
              onClick={this.populateEditor(QUICK_SORT_EXAMPLE, "")}>Quick Sort
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default CodeInput;
