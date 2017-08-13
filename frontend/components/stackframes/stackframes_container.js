import { connect } from 'react-redux';
import Stackframes from './stackframes';

const mapStateToProps = (state) => {
  return {
    stackframes: state.metrics.stack
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stackframes);
