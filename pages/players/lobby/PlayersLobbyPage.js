import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Router from 'next/router';
import find from 'lodash/find';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { MdDone, MdClose } from 'react-icons/md';
import MainLayout from '../../../components/layout/MainLayout';
import CardsPlayerLayout from '../../../components/cards/player/CardsPlayerLayout';
import CardPlayer from '../../../components/cards/player/CardPlayer';



const PlayersLobbyPage = ({ playerId, addPlayer, readyPlayer, firestore }) => {


  useFirestoreConnect([
    {
      collection: 'users',
      orderBy: ['createdAt', 'desc'],
    },
    {
      collection: 'game',
    },
  ])
  const games = useSelector(state => state.firestore.ordered.game);
  const game = _.find(games, g => g.active);
  const users = useSelector(state => state.firestore.ordered.users);

  const player = find(users, u => u.id === playerId);

  const onJoin = () => {
    if (!_.isEmpty(player)) return;
    addPlayer()
  };

  const onReady = () => {
    if (_.isEmpty(player)) return;
    readyPlayer(!player.ready);
  }
  if (game) {
    Router.push(`/players/questions/${game.id}`);
  }

  return (
    <MainLayout>
      <CardsPlayerLayout>
        {map(users, (p, i) => <CardPlayer
          key={p.id || i}
          onClick={() => {
            if (p.id === playerId) {
              onReady();
            }
          }}
          background={p.ready ? '#8cd677' : '#fff'}
          color={p.ready ? '#fff' : '#000'}
          disabled={p.id !== playerId}
          self={playerId === p.id}
        >
          <div className="title">
            <div>{p.name}</div>
            <div>{p.ready ? <MdDone color="#fff" size="38px" /> : <MdClose color="#000" size="38px" />}</div>
          </div>
        </CardPlayer>
        )}
        <CardPlayer
          background={!get(player, 'ready', false) ? '#54d35d' : '#d54b4f'}
          color="#fff"
          onClick={() => isEmpty(player)
            ? onJoin()
            : onReady()}
        >
          {isEmpty(player)
            ? 'ВОЙТИ'
            : get(player, 'ready', false)
              ? 'НЕ ГОТОВ'
              : 'ГОТОВ'
          }</CardPlayer>
      </CardsPlayerLayout>
    </MainLayout>
  );
};


export default PlayersLobbyPage;
