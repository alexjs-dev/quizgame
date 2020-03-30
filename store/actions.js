import _ from 'lodash'
import Router from 'next/router';
import * as types from './types';

const emojis = _.shuffle(['💀', '👻', '👽', '🤖', '💩', '😺', '🤠', '🤡', '👠', '💍', '🧠', '🦔', '🐢', '🐷', '🐎', '🦖']);

export const addPlayer = () => {
  return async (dispatch, getState, getFirebase) => {
    try {
      const firestore = getFirebase().firestore();
      let name = _.sample(emojis);
      const existingPlayers = await firestore.collection('users').get();
      if (existingPlayers.docs) {
        const existingNames = _.map(existingPlayers.docs, doc => doc.name);
        const filteredEmojis = _.uniq([...existingNames, ...emojis]);
        name = _.sample(filteredEmojis);
      }
      await firestore.collection('users').doc().set({ name, ready: false, createdAt: new Date() });
      const player = await firestore.collection('users').where('name', '==', name).get();
      if (player.docs && player.docs[0]) {
        const playerId = player.docs[0].id;
        dispatch({
          type: types.ADD_PLAYER,
          payload: playerId,
          name,
        })
      }
    } catch (err) {
      console.error(err);
    }
  }

}

export const readyPlayer = (value) => {
  return async (dispatch, getState, getFirebase) => {
    try {
      const state = getState();
      const { reducer } = state;
      const { playerId } = reducer;
      if (playerId) {
        const firestore = getFirebase().firestore();
        const ref = await firestore.collection('users').doc(playerId);
        if (ref.id) {
          await ref.update({ ready: value });
          dispatch({
            type: 'READY_PLAYER',
          })
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}


export const removePlayerById = (playerId) => {
  return async (dispatch, getState, getFirebase) => {
    try {
      if (playerId) {
        const firestore = getFirebase().firestore();
        const ref = await firestore.collection('users').doc(playerId).delete();
        console.log(ref)
        dispatch({
          type: 'REMOVE_PLAYER',
          payload: playerId,
        })
      }
    } catch (err) {
      console.error(err);
    }
  }
}


export const startGame = ({ users, questions, subjects }) => {
  return async (dispatch, getState, getFirebase) => {
    try {
      const firestore = getFirebase().firestore();
      const gamesRef = await firestore.collection('game').get();
      const usersRef = await firestore.collection('users').get();
      const userIds = _.map(_.get(usersRef, 'docs', []), u => u.id);
      const gameIds = _.map(_.get(gamesRef, 'docs', []), g => g.id);
      if (!_.isEmpty(gameIds)) {
        await Promise.all(
          _.map(gameIds, async id => {
            const ref = await firestore.collection('game').doc(id);
            if (ref.id) {
              await ref.update({ active: false });
            }
          })
        )
      }
      await firestore.collection('game').doc().set(
        { 
          active: true,
          users,
          questions,
          subjects,
          activeQuestionId: '',
        });
      const newGame = await firestore.collection('game').where('active', '==', true).get();
      if (!_.isEmpty(newGame.docs)) {
        const id = _.head(newGame.docs).id;
        Router.push(`/game/questions/${id}`);
        dispatch({
          type: 'START_GAME',
          payload: id,
        })
      }

    } catch (err) {
      console.error(err);
    }
  }
}

        // firestore.add('users', { name, ready: false, createdAt: new Date() });
        // firestore
        //   .collection('users')
        //   .push({
        //     name,
        //     ready: false,
        //     createdAt: new Date(),
        //   })
        //   .then((doc) => {
        //     console.log('doc', doc);
        //     dispatch({
        //       type: types.ADD_PLAYER,
        //       payload: doc.id,
        //       name,
        //     })
        //   }).catch(err => console.error(err));