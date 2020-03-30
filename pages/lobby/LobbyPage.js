import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  background: #c3c3c3;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const Field = styled.div`
  color: ${props => props.color ? props.color : '#fff'};
  font-size: 2em;
  border: 1px solid #fff;
  text-align: center;
`;

const FieldClickable = styled(Field)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
    border: 1px solid #b3b3b3;
  }
`;

const LobbyPage = ({ playerId, addPlayer, firestore }) => {

  useFirestoreConnect([
    {
      collection: 'game',
    },
    {
      collection: 'users',
    },
  ]);
  const games = useSelector(state => state.firestore.ordered.game);
  const game = _.find(games, g => g.active);
  const users = useSelector(state => state.firestore.ordered.users);

  if (game) {
    Router.push(`/players/questions/${game.id}`);
  }
  // http://localhost:3002/players/questions/eTh4LZXlYB6JO31oloVa

  const onJoin = (gameId) => {
    const ref = firestore.collection('game').doc(gameId);
    const game = _.find(games, g => g.id === gameId);
    if (ref && game) {
      const users = _.get(game, 'users', []);
      if (_.some(users, u => u.id === playerId)) {
        Router.push(`/players/questions/${gameId}`);
      } else {
        // addPlayer();
      }
    }
  };



  return (
    <Root>
      {_.map(_.filter(games, g => g.active), (game, index) => {
        return (
          <Row key={game.id}>
            <Field>Game: #{index + 1}</Field>
            <Field>Players: {_.toString(_.map(_.get(game, 'users', []), u => u.name))}</Field>
            <FieldClickable color="#589ef8" onClick={() => onJoin(game.id)}>JOIN</FieldClickable>
          </Row>
        )
      })}
    </Root>
  )
};

export default LobbyPage;