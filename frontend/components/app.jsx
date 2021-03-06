import React from 'react';
import { Route } from 'react-router-dom';
import HomeContainer from './home/home_container';
import NavbarContainer from './navbar/navbar_container';
import MetricsContainer from './metrics/metrics_container';
import StackframesContainer from './stackframes/stackframes_container';


const App = () => {
  return (
    <div className="app-wrapper">
      <div className="background-div"></div>
      <div className="navigation-background"></div>
      <div className="navigation-wrapper">
        <div className="spacer"></div>
        <div className="spacer"></div>
        <h1>PourOverJS <img src="http://res.cloudinary.com/dsopsl7zd/image/upload/v1502613251/PourOverJS-Logo-Color-Better.jpg_d3c4gu.jpg"></img></h1>

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
          <StackframesContainer />
        </div>
        <div className="metrics-wrapper">
          <MetricsContainer />
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
