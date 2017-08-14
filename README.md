# PourOverJS

[heroku]: http://pouroverjs.herokuapp.com

[PourOverJS][heroku] is a `JavaScript` profiler and code editor which allows users to analyze a block of code. It will output performance metrics of the submitted code and display stack frames. As a result, users will be able to identify inefficiencies, chokepoints, and debug their code more intuitively. Users will also be able to login and save code snippets to the database.

![Image](./Docs/PourOverJS-main-page.jpg)

## Overview of Features

PourOverJS is a web application built using the MERN (MongoDB, Express.js, React.js-Redux, Node.js) stack. The following features are implemented

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
  - Etraverse(Abstract Syntax Tree injection)
  - Local-storage(session storage)
  - Mongoose(MongoDB connection)
  - Passport(User authtication)
  - Regenerator(ES6 to ES5 syntax transformation)
  - React-Ace(Browser code editor)

## Features and Implementation

### Authentication

Users can create an account and log into our site. They can save any code snippets
and associated analyses to our database for later perusal.

### Call Stack Visualization

When the user clicks "Compile", the code in the editor, taken as a String, is converted
into an Abstract Syntax Tree using Esprima, which is a popular JavaScript parser:

```js
let ast = esprima.parse(this.code, {loc: true})
```

Then, the AST is traversed to using Estraverse to identify expression statements and
push them into a stack for later. These push statements are injected throughout the snippet:

```js
parent.body.splice(parent.body.indexOf(node), 0, esprima.parse(`stackPourOver.push(
  ['${level.name ? level.name : (level.property ? level.property.name : level.property)}',
  ${node.loc.start.line}])`))
```

Information about the starting and ending line numbers of function declarations are also
collected to determine which stack frames each expression statement belongs to, if any:

```js
arr.push(esprima.parse(`functionDeclarationsPourOver['${node.id.name}'] = [${node.loc.start.line}, ${node.loc.end.line}]`))
```

Afterwards, the user may click "Next Step" to walk through the stack information we have
collected and see a visualization on the right. When inside a certain stack frame, that frame
will stay at the bottom and not pop off until it is exited.

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

In addition to the features that have been implemented, we plan to add
more features in the future. The following are next steps for PourOverJS:

### Add more types of expression statements to call stack
### Performance metrics visualization with D3.js
### O'auth sign in with Github and Google
### Asynchronous event loop visualization
### Scope display as users step through the code
### Demonstration of variable closure as users step through the code

[crud_proto]: https://github.com/aravi3/MERN_CRUD_Application
