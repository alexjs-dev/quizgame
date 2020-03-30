import * as types from './types';

export const addPlayer = ({ dispatch, player }) => {
  dispatch({ type: types.ADD_PLAYER, payload: player });
};

export const removePlayerByIndex = ({ dispatch, index }) => {
  dispatch({ type: types.REMOVE_PLAYER_BY_INDEX, payload: index });
};