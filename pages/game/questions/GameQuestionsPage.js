import React from 'react';
import QuestionsLayout from '../../../components/layout/QuestionsLayout';

const GameQuestionsPage = ({ firestore }) => {
  return <QuestionsLayout
    firestore={firestore}
    playerId={null}
    isAdmin
  />
};

export default GameQuestionsPage;