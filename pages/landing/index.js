import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirestore } from 'react-redux-firebase';
import LandingPage from './LandingPage';


const mapStateToProps = ({ reducer }) => {
  return {
    playerId: reducer.playerId,
  }
};
const mapDispatchToProps = {
};

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps)
)(LandingPage);