import React from 'react';

class Stackframes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let stackframes = [];
    let stackframesLength = this.props.stackframes ? this.props.stackframes.length : -1;

    for(let i = stackframesLength - 1 ; i >= 0 ; i--) {
      stackframes.push(this.props.stackframes[i]);
    }

    let stackframesDisplay = "";

    if(stackframes) {
      stackframesDisplay = stackframes.map( (el,index) => {
        return (
          <li className={`stack-frames-list-item-${index}`}
            key={index}>
            {el}
          </li>
        );
      })
    }

    return (
      <div className="stack-frames-wrapper">
        <ul className="stack-frames-list">
          {stackframesDisplay}
        </ul>
      </div>
    );
  }
}

export default Stackframes;
