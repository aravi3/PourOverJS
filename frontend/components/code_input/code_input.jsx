import React from 'react';
import { Link } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class CodeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: ""
    };

    this.setCode = this.setCode.bind(this);
  }

  setCode(newVal) {
    let code = newVal;
    this.setState({ code });
  }

  render() {
    return (
      <div>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={this.setCode}
          name="code-input"
          value={this.state.code}
          editorProps={{$blockScrolling: true}}
        />
      </div>
    );
  }
}

export default CodeInput;
