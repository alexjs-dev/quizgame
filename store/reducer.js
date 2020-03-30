import {
  ADD_PLAYER,
} from './types';

const initialState = {
  playerId: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      return {
        ...state,
        playerId: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;