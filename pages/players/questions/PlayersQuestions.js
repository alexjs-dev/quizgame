import React from 'react';
import QuestionsLayout from '../../../components/layout/QuestionsLayout';

const GameQuestionsPage = ({ firestore, playerId }) => {
  return <QuestionsLayout
    firestore={firestore}
    playerId={playerId}
    isAdmin={false}
  />
};

export default GameQuestionsPage;