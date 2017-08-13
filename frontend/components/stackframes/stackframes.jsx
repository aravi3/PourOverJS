import React from 'react';

class Stackframes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const stackframes = this.props.stackframes;
    let stackframesDisplay = "";

    if(stackframes) {
      stackframesDisplay = stackframes.map( (el,index) => {
        return (
          <li
            key={index}>
            {el[0]}
          </li>
        );
      })
    }

    return (
      <div>
        <ul>
          {stackframesDisplay}
        </ul>
      </div>
    );
  }
}

export default Stackframes;
