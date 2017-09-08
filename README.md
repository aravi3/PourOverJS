# PourOverJS

[heroku]: http://pouroverjs.herokuapp.com
[pourover]: pouroverjs.com

[PourOverJS][heroku] is a `JavaScript` profiler and code editor. It outputs performance metrics for the submitted code and displays a step-by-step stack frame visualization. Users can also save code snippets to the database.

[Live link][pourover]

![Image](http://res.cloudinary.com/dnj5rmvun/image/upload/v1503292077/pourover_main_qjegdw.png)

## Overview of Features

PourOverJS is a web application built using the MERN (MongoDB, Express.js, React.js-Redux, Node.js) stack. The following features have already been implemented:

  - [x] Authentication
  - [x] Online code editor - snippets can be saved to database
  - [x] Syntax highlighting and auto-indentation
  - [x] Three example code snippets available to demonstrate functionality
  - [x] Five performance metrics are displayed after users click "Compile":
        - Execution Time
        - Return value
        - Total function calls
        - Function chain (demonstration of closure)
        - Variables declared in each scope
  - [x] Users can step through code and visualize call stack

## Technologies

- FRONT END:
	- React.js with Redux

- BACK END:
	- Node.js
	- Express.js  
	- MongoDB

- NPM PACKAGES/OTHER LIBRARIES:
  - Webpack(bundle)
  - Nodemon(server refresh)
  - BodyParser(mongodb response parser)
  - BCrypt/SCrypt(password encryption)
  - Babel(ES6 to ES5 syntax transformation)
  - Esprima(Abstract Syntax Tree transformation)
  - Estraverse(Abstract Syntax Tree injection)
  - Local-storage(session storage)
  - Mongoose(MongoDB connection)
  - Passport(User authtication)
  - Regenerator(ES6 to ES5 syntax transformation)
  - React-Ace(Browser code editor)

## Features and Implementation

### Authentication

Users can create an account to log in to PourOverJS. They can save any code snippets
and associated analyses to the database for later perusal.

### Call Stack Visualization

When the user clicks "Compile" the code in the editor — taken as a String — is converted
into an Abstract Syntax Tree using Esprima, a popular JavaScript parser:

```js
let ast = esprima.parse(this.code, {loc: true})
```

The AST is then traversed with Estraverse to identify expression statements and
push them into a stack for later. These push statements are injected throughout the snippet:

```js
parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stackPourOver.push(
  ['${level.name ? level.name : (level.property ? level.property.name : level.property)}',
  ${node.loc.start.line}])`))
```

Information about the starting and ending line numbers of function declarations is also
collected to determine which stack frames each expression statement belongs to, if any:

```js
arr.push(esprima.parse(`functionDeclarationsPourOver['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`))
```

Clicking "Next Step" allows the user to walk through the stack information we have
collected and view a visualization of the data. When inside a certain stack frame, that frame will remain in view and not pop off until it is exited.

### Performance Metrics

 When the user clicks "Compile", the code in the editor is run in a sandbox to
 collect metrics such as execution time, return value, number of function calls,
 variables declared in each scope, and any function inheritance chains:

 - The execution time is collected by placing a performance.now() statement before and
 after execution of the code and subtracting the two values.
 - The return value is simply the output value of the entire snippet from being run
 in the sandbox.
 - The rest of the metrics are collected by analyzing and injecting code into the
 Abstract Syntax Tree.

## Future Directions for the Project

In addition to the features that have been implemented, several additional features are planned for the future. The following are the next steps for PourOverJS:

- Add more types of expression statements to call stack
- Performance metrics visualization with D3.js
- O'auth sign in with Github and Google
- Asynchronous event loop visualization
- Scope display as users step through the code
- Demonstration of variable closure as users step through the code

[crud_proto]: https://github.com/aravi3/MERN_CRUD_Application
