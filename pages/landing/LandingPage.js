import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import MainLayout from '../../components/layout/MainLayout';


const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    margin: 0.5em 0;
  }
  a {
    font-size: 2em;
    color: #fff;
  }
`;

const LandingPage = ({ playerId }) => {
  useFirestoreConnect([
    {
      collection: 'game',
    },
  ]);
  const games = useSelector(state => state.firestore.ordered.game);
  const activeGame = _.find(games, g => g.active);

  return (
    <MainLayout>
      <Content>
        <div>
          <Link href={activeGame && activeGame.id ? `/players/questions/${activeGame.id}` : '/players/lobby'}><a>Join game</a></Link>
        </div>
        <div>
          <Link href={activeGame && activeGame.id ? `/game/questions/${activeGame.id}` : '/players/create'}><a>Admin</a></Link>
        </div>
        <div>
          <Link href="/game/createquestions"><a>Create questions</a></Link>
        </div>
      </Content>
    </MainLayout>
  );
};

export default React.memo(LandingPage, (prev, next) => _.isEqual(prev, next));
