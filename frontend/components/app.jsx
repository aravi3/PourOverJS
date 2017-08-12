import React from 'react';
import { Route } from 'react-router-dom';
import HomeContainer from './home/home_container';
import NavbarContainer from './navbar/navbar_container';


const App = () => {
  return (
    <div className="app-wrapper">
      <div className="background-div"></div>
      <div className="navigation-background"></div>
      <div className="navigation-wrapper">
        <div className="spacer"></div>
        <div className="spacer"></div>
        <h1>PourOverJS</h1>
        <div className="spacer"></div>
        <div className="Navbox">
          <NavbarContainer />
        </div>
      </div>

      <div className="main-wrapper">
        <div className="input-wrapper">
          <Route path="/" component={HomeContainer} />
        </div>

        <div className="stack-wrapper">
        </div>
        <div className="metrics-wrapper">
        </div>

        <div className="footer-background">
          <span>
            Arvind Ravi
          </span>
          <span>
            Atom C
          </span>
          <span>
            Justin White
          </span>
          <span>
            Xiaoyuan Zhu
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;

// <div className="controls-wrapper">
// </div>
