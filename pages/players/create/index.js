import { connect } from 'react-redux';
import { compose } from 'redux';
import PlayerCreatePage from './PlayerCreatePage';
import { withFirestore } from 'react-redux-firebase';
import { removePlayerById, startGame  } from '../../../store/actions';

const mapStateToProps = () => {
  return {}
};
const mapDispatchToProps = {
  removePlayerById,
  startGame,
};

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps)
)(PlayerCreatePage);


