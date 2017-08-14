import React from 'react';

class Metrics extends React.Component {
  constructor(props) {
    super(props);
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
          {declaration}:
          {allVariables.map( (el2, index2) => {
            return (
              <div key={index2} className="variable-style">
                {el2}
              </div>
            );
          })}
        </li>
      );
    }) : null;

    const closureDisplay = closureChain ? closureChain.map((el, index) => {
      return (
        <div key={index}>
          {el.join("-->")}
        </div>
      );
    }): null;

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
            { returnValue ? returnValue.toString() : returnValue }
          </div>
        </div>
        <div className="title-wrapper">
          Function Chain:
          <ul className="inside-list">
            {closureDisplay}
          </ul>
        </div>
        <div className="title-wrapper">
          Varible Declarations:
          <ul className="inside-list vars-display">
            {variablesDisplay}
          </ul>
        </div>
      </div>
    );
  }
}

export default Metrics;
