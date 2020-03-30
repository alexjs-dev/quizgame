import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirestore } from 'react-redux-firebase';
import PlayersLobbyPage from './PlayersLobbyPage';
import { addPlayer, readyPlayer } from '../../../store/actions';


// PlayersLobbyPage.getInitialProps = async ctx => {
//   return {};
// }
 
const mapStateToProps = ({ reducer }) => {
  return {
    playerId: reducer.playerId,
  }
};
const mapDispatchToProps = {
  addPlayer,
  readyPlayer,
};

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps)
)(PlayersLobbyPage);