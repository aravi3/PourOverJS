import React from 'react';
import { Route } from 'react-router-dom';
import HomeContainer from './home/home_container';
import NavbarContainer from './navbar/navbar_container';


const App = () => {
  return (
    <div className="app-wrapper">
      <div className="background-div"></div>
      <div className="navigation-wrapper">
      <h1>PourOverJS</h1>
      </div>

      <div className="main-wrapper">
        <div className="input-wrapper">
          <Route path="/" component={HomeContainer} />
        </div>

        <div className="stack-wrapper">
          <div>
            <NavbarContainer />
          </div>
        </div>
        <div className="metrics-wrapper">
        </div>

      </div>
    </div>
  );
};

export default App;

// <div className="controls-wrapper">
// </div>
