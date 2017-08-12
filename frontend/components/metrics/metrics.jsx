import React from 'react';

class Metrics extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    console.log("hello");
    console.log(props.allMetrics);
  }

  render() {

    return (
      <div>
        hello
      </div>
    );
  }
}

export default Metrics;
