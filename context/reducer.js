import * as types from './types';

const reducer = (state, action) => {
  switch (action.type) {
    case types.ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, action.payload],
      };
    case types.REMOVE_PLAYER_BY_INDEX:
      const array = state.players;
      if (array) {
        array.splice(action.payload, 1);
      }
      return {
        ...state,
        players: !array ? [] : array,
      };
    default:
      return state;
  }
};

export default reducer;