import React from 'react';

class Metrics extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    console.log(props.allMetrics);
  }

  render() {
    let {
        functionCalls,
        closureChain,
        executionTime,
        returnValue,
        variablesDeclared
    } = this.props.allMetrics;

    const variablesDisplay = variablesDeclared ? variablesDeclared.map( (el, index) => {
      let allVariables = /\:(.*)/.exec(el)[1].split(",");
      let declaration = /(.*)\:/.exec(el)[1];

      return (
        <li
          key={index}>
          {declaration}
          {allVariables.map( (el2, index2) => {
            return (
<<<<<<< HEAD
              <div
                key={index2}
                style={{ color: "red" }}>
=======
              <div className="variable-style">
>>>>>>> eee63155c8fa097224e1e8162e891fce941f0155
                {el}
              </div>
            );
          })}
        </li>
      );
    }) : null;

    const closureDisplay = closureChain ? closureChain.join(' --> ') : null;

    return (
      <div>
        <div className="title-wrapper">
          Execution Time:
          <div className="inside-list">
            { executionTime }
          </div>
        </div>
        <div className="title-wrapper">
          Function Calls:
          <div className="inside-list">
            { functionCalls }
          </div>
        </div>
        <div className="title-wrapper">
          Return Value:
          <div className="inside-list">
            { returnValue }
          </div>
        </div>
        <div className="title-wrapper">
          Function Chain:
          <ul className="inside-list">
            {closureDisplay}
          </ul>
        </div>
        <div className="title-wrapper">
          Varibles Declared:
          <ul className="inside-list">
            {variablesDisplay}
          </ul>
        </div>
      </div>
    );
  }
}

export default Metrics;
