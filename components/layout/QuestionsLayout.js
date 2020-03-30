import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useFirestoreConnect } from 'react-redux-firebase';
import {
  Root,
  Field,
  PlayersRow,
  QuestionsTable,
  FieldWrapped,
  Actions,
  Action,
  ControlPanel
} from './QComponents';

const GameQuestionsPage = ({ firestore, isAdmin, playerId }) => {
  const router = useRouter();
  const id = _.get(router, 'query.pid');
  const [game, setGame] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);


  useFirestoreConnect([
    {
      collection: 'game',
      doc: id,
    },
  ]);
  const games = useSelector(state => state.firestore.ordered.game);

  useEffect(() => {
    if (!_.isEmpty(games)) {
      const game = _.head(games);
      setGame(game);
    }
  }, [games]);

  if (!game) return null;
  if (!game.active) {
    router.push('/');
  }

  const getActiveUser = (userId) => {
    const activeUserId = userId || _.get(game, 'activeUserId');
    const users = _.get(game, 'users', []);
    const user = _.find(users, u => u.id === activeUserId);
    return _.get(user, 'name', '');
  }

  const onCorrectAnswer = () => {
    if (game.id && game.activeUserId) {
      const ref = firestore.collection('game').doc(game.id);
      const questions = _.map(game.questions, q => {
        if (q.id === game.activeQuestionId) {
          return { ...q, userId: game.activeUserId };
        }
        return q;
      });
      ref.update({
        questions,
        activeUserId: null,
        activeQuestionId: null,
      });
    }
  }

  const onWrongAnswer = () => {
    if (game.id && game.activeUserId) {
      const ref = firestore.collection('game').doc(game.id);
      const questions = _.map(game.questions, q => {
        if (q.id === game.activeQuestionId) {
          const ids = _.get(q, 'wrongUserIds', []);
          return { ...q, wrongUserIds: _.uniq([...ids, game.activeUserId]) };
        }
        return q;
      });
      ref.update({
        questions,
        activeUserId: null,
      });
    }
  }

  const onSetQuestion = (question) => {
    if (game.id && !game.activeQuestionId && !question.userId && isAdmin) {
      const ref = firestore.collection('game').doc(game.id);
      ref.update({
        activeQuestionId: question.id,
      });
    };
  }

  const onSetAnswer = () => {
    if (game.id && !game.activeUserId) {
      const ref = firestore.collection('game').doc(game.id);
      ref.update({
        activeUserId: playerId,
      });
    }
  };

  const onFinishGame = () => {
    if (game.id && isAdmin) {
      const userIds = _.map(game.users, u => u.id);
      _.forEach(userIds, uid => {
        const u = firestore.collection('users').doc(uid);
        u.update({
          ready: false,
        });
      });
      const ref = firestore.collection('game').doc(game.id);
      ref.update({
        active: false,
      });


    }
  }

  const getUserPoints = (userId) => {
    const array = _.get(game, 'questions', []);
    const sum = _.sumBy(array, item => {
      const wrongIds = _.get(item, 'wrongUserIds', []);
      let val = 0;
      if (_.includes(wrongIds, userId)) {
        val -= item.points;
      }
      if (item.userId === userId) {
        val += item.points
      }
      return val;
    });
    return sum;
  };
  const isGameOver = _.size(_.compact(_.map(game.questions, q => q.userId))) === _.size(game.questions);

  const getWinner = () => {
    const usersList = _.map(game.users, u => {
      const points = getUserPoints(u.id);
      return { ...u, points };
    });
    const winner = _.head(_.sortBy(usersList, u => u.points).reverse());
    return winner;
  };
  if (isGameOver) {
    const winner = getWinner();
    return (
      <Root centered>
        <FieldWrapped success={winner.id === playerId}>
          <div>Победитель:</div>
          <div>{winner.name}</div>
        </FieldWrapped>
        {isAdmin && (
          <Actions>
            <Action onClick={() => onFinishGame()}>Завершить игру</Action>
          </Actions>
        )}
      </Root>
    )
  }

  if (game.activeQuestionId) {
    return (
      <Root centered>
        <Field>{_.get(_.find(game.questions, q => q.id === game.activeQuestionId), 'question', '')}</Field>
        {isAdmin
        ? <Field onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer
           ? _.get(_.find(game.questions, q => q.id === game.activeQuestionId), 'answer', '')
           : '**********'}
        </Field>
        : null}
        <FieldWrapped>
          <div>Отвечает:</div>
          <div>{getActiveUser()}</div>
        </FieldWrapped>
        <Actions>
          {isAdmin && [
            <Action key="correct" background="#4cd639" onClick={() => onCorrectAnswer()} color="#fff" disabled={_.isEmpty(_.get(game, 'activeUserId'))}>Правильно</Action>,
            <Action key="wrong" background="#ff0000" onClick={() => onWrongAnswer()} disabled={_.isEmpty(_.get(game, 'activeUserId'))}>Не правильно</Action>,
          ]}
          {!isAdmin && (
            <Action disabled={!_.isEmpty(_.get(game, 'activeUserId'))} onClick={() => onSetAnswer()}>Ответить</Action>
          )}
        </Actions>
      </Root>
    )
  }



  return (
    <Root>
      <PlayersRow count={_.size(game.users)}>
        <Field>Игроки</Field>
        {_.map(game.users, (player, index) => <FieldWrapped success={player.id === playerId} key={`player-${index}`}>
          <div>{player.name}</div>
          <div>{getUserPoints(player.id)}</div>
        </FieldWrapped>
        )}
      </PlayersRow>
      <div>
        {_.map(game.subjects, subject => {
          return (
            <QuestionsTable key={subject.id}>
              <Field>{subject.name}</Field>
              {_.map(_.sortBy(_.filter(game.questions, q => q.subjectId === subject.id), qq => qq.points), question =>
                <Field background={!question.userId && isAdmin ? '#1cb5ed' : null} onClick={() => onSetQuestion(question)} key={question.id}>{question.userId ? getActiveUser(question.userId) : question.points}</Field>
              )}
            </QuestionsTable>
          )
        })}
      </div>
      {isAdmin && (
        <ControlPanel>
          <button onClick={() => onFinishGame()}>Завершить игру</button>
        </ControlPanel>
      )}
    </Root>
  )
};

export default GameQuestionsPage;