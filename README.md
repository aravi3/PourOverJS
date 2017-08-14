# PourOverJS
  [heroku]: http://pouroverjs.herokuapp.com

  [PourOverJS][heroku] a `JavaScript` profiler and stack visualizer which allows users to test a block of code. It will analyze the individual components of the submitted code and display stack frames and metrics for each function.
  As a result, users will be able to identify inefficiencies, chokepoints, and debug their code more intuitively. Users will be able to save code snippets to the database and keep track of their functions.

## Minimum Viable Product
PourOverJS is a web application built using the MERN (MongoDB, Express.js, React.js-Redux, Node.js) stack. The following features are implemented

  - [x] Login/signup and logout authentication
  - [x] Users are able to enter code snippets into the text editor
  - [x] Syntax highlighting and auto-indentation
  - [x] Users can save code snippets to the database
  - [x] Users can retrieve code snippets from as well as delete code in the database
  - [x] Three example code snippets are available on the page
  - [x] Five performance metrics are displayed after users click the "Run>>" button:
        - Execution Time
        - Total function calls
        - Function chain/Closure chain
        - Variables declared in each scope
        - Return value
  - [x] Users are able to step through the code and visualize the main stack

## Screen Shots -- Add photos once Atom's merge request get resolved
  ![Image](./Docs/PourOverJS-main-page.jpg)

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

 - ADD STUFF

### Stackframes Visualization

 - ADD STUFF

### Performance Metrics

 - ADD STUFF

### Code CRUD (not too important)

 - ADD STUFF

### Maybe talk about technologies we used and why we chose them??

 - ADD STUFF

## Implementation Timeline (should we delete this?)
We are using the `Scrum framework` of `Agile Development`. By design, we will not plan our second `Sprint` until completion of the first `Sprint`.

### Sprint 1:  (4 days)

#### Day 1

  * **Justin:** Auth
  * **Xiaoyuan:** Auth
  * **Arvind:** Input Field
  * **Atom:** Input Field and Syntax Highlighting

#### Day 2

  * **Justin:** Stack Frames and stop JS asychronicity
  * **Xiaoyuan:** Stack Frames and stop JS asychronicity
  * **Arvind:** Stack Frames and stop JS asychronicity
  * **Atom:** Stack Frames and Syntax Highlighting

#### Day 3

  * **Justin:** Stack Frames and stop JS asychronicity
  * **Xiaoyuan:** Stack Frames and stop JS asychronicity
  * **Arvind:** Stack Frames and and stop JS asychronicity
  * **Atom:** Style Stack Frames

#### Day 4

  * **Justin:** Event Loop
  * **Xiaoyuan:** Event Loop
  * **Arvind:** Examples, Function Metrics
  * **Atom:** Function Metrics

### Sprint 2:  (3 days)
SEE ABOVE, TBD

#### Day 5

  * **Justin:** CRUD
  * **Xiaoyuan:** CRUD
  * **Arvind:** Bug-fighting
  * **Atom:** Bug-fighting

#### Day 6

  * **Justin:** Stack Frames
  * **Xiaoyuan:** Stack Frames
  * **Arvind:** Stack Frames
  * **Atom:** Clean up, Style


#### Day 7

  * **Justin:** Stack Frames
  * **Xiaoyuan:** Stack Frames
  * **Arvind:** Stack Frames
  * **Atom:** Production ReadME, Final Style

### Features To Be Implemented
- [ ] Performance metrics visualization with D3.js
- [ ] O'auth sign in with Github and Google
- [ ] Optimized Implementation for each example and efficiency comparisons
- [ ] Asynchronous event loop visualization
- [ ] Variable type/scope display as users step through the code
- [ ] Optimized closure chain display as users step through the code
- [ ] Console output display

[crud_proto]: https://github.com/aravi3/MERN_CRUD_Application
