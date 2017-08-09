import React from 'react';
import { Link } from 'react-router-dom';
import CodeInputContainer from '../code_input/code_input_container';
import NavbarContainer from '../navbar/navbar_container';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <NavbarContainer />
        </div>

        <div className="home-wrapper">
          <CodeInputContainer />
        </div>
      </div>
    );
  }
}

export default Home;
