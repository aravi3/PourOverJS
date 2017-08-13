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
