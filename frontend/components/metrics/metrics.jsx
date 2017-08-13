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
      return (
        <li
          key={index}>
          {el}
        </li>
      );
    }) : null;

    const closureDisplay = closureChain ? closureChain.map( (el, index) => {
      return (
        <li
          key={index}>
          {el}
        </li>
      );
    }) : null;

    return (
      <div>
        <div>
          Execution Time:
          { executionTime }
        </div>
        <div>
          Function Calls:
          { functionCalls }
        </div>
        <div>
          Return Value:
          { returnValue }
        </div>
        <div>
          Function Chain:
          <ul>
            {closureDisplay}
          </ul>
        </div>
        <div>
          Varibles Declared:
          <ul>
            {variablesDisplay}
          </ul>
        </div>
      </div>
    );
  }
}

export default Metrics;
