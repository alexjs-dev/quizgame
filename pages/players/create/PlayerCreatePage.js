import React, { useState } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import styled from 'styled-components';
import { MdDone, MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import MainLayout from '../../../components/layout/MainLayout';
import CardsPlayerLayout from '../../../components/cards/player/CardsPlayerLayout';
import CardPlayer from '../../../components/cards/player/CardPlayer';

const StyledModal = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 1;
  padding: 10px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2em 0;
  }
  input[type=checkbox] {
    width: 14mm;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 14mm;
    border: 0.1mm solid black;
    outline: 0;
    position: relative;
}

input[type=checkbox]:checked {
    background-color: #5daa63;
}

input[type=checkbox]:checked:after {
    width: 3mm;
    height: 10mm;
    position: absolute;
    top: 50%;
    left: 25%;
    border: solid white;
    border-width: 0 2mm 2mm 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg) translate(-50%, -50%);
    content: "";
    display: inline-block;
}
button {
  font-size: 3em;
  background: #12c946;
  color: #fff;
  align-self: center;
}
`;

const PlayerCreatePage = ({ firestore, removePlayerById, startGame }) => {
  const [selectedSubjects, setSubjects] = useState([]);
  const [selectedQuestions, setQuestions] = useState([]);
  const [isSubjectsModal, setSubjectsModal] = useState(false);
  useFirestoreConnect([
    {
      collection: 'users',
      orderBy: ['createdAt', 'desc'],
    },
    {
      collection: 'questions',
    },
    {
      collection: 'subjects',
    },
  ]);
  const questions = useSelector(state => state.firestore.ordered.questions);
  const users = useSelector(state => state.firestore.ordered.users);
  const subjects = useSelector(state => state.firestore.ordered.subjects);
  const disabled = isEmpty(users) || some(users, u => !u.ready) || isEmpty(selectedSubjects) || isEmpty(selectedQuestions);

  const onRemovePlayerById = (id) => {
    removePlayerById(id)
  };
  const onStartGame = () => {
    if (disabled) return;
    const userIds = _.map(users, u => u.id);
    _.forEach(userIds, uid => {
      const u = firestore.collection('users').doc(uid);
      u.update({
        ready: false,
      });
    });
    startGame({ users, questions: selectedQuestions, subjects: selectedSubjects });
  };

  const handleCheckbox = (e) => {
    const add = event.target.checked;
    if (add) {
      setSubjects(_.uniqBy([...selectedSubjects, _.find(subjects, s => s.id === e.target.value)], 'id'))
    } else {
      setSubjects(_.filter(selectedSubjects, s => s.id !== event.target.value))
    }
  }

  const handleAddSubjects = () => {
    setSubjectsModal(false);
    const selectedSubjectIds = _.map(selectedSubjects, s => s.id);
    const selectedQuestions = _.filter(questions, q => _.includes(selectedSubjectIds, q.subjectId));
    setQuestions(selectedQuestions);
  };

  return (
    <MainLayout>
      {isSubjectsModal && (
        <StyledModal>
          <div>
            {_.map(subjects, s => {
              return [
                <input key={s.id} type="checkbox" name={s.name} value={s.id} onChange={handleCheckbox} />,
                <label key={`label-${s.id}`} for={s.name}>{s.name}</label>,
              ]
            })}
          </div>
            <div>
            <button onClick={() => handleAddSubjects()}>Добавить</button>
            </div>
        </StyledModal>
      )}
      <CardsPlayerLayout>
        {map(users, (p, i) => <CardPlayer
          key={p.id || i}
          onClick={() => onRemovePlayerById(p.id)}
          background={p.ready ? '#8cd677' : '#fff'}
          color={p.ready ? '#fff' : '#000'}
        >
          <div className="title">
            <div>{p.name}</div>
            <div>{p.ready ? <MdDone color="#fff" size="38px" /> : <MdClose color="#000" size="38px" />}</div>
          </div>
        </CardPlayer>
        )}
        <CardPlayer onClick={() => setSubjectsModal(true)}>Темы</CardPlayer>
        <CardPlayer disabled={disabled} onClick={() => onStartGame()}>Начать</CardPlayer>
      </CardsPlayerLayout>
    </MainLayout>
  );
};

export default PlayerCreatePage;
