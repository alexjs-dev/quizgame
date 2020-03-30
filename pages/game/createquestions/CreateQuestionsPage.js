import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Link from 'next/link';
import { Table, Input, Modal, Popconfirm, message } from 'antd';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { FiTrash2, FiHome } from 'react-icons/fi';


const { Column, ColumnGroup } = Table;

const Root = styled.div`
  padding: 0.5em;
  width: 100vw;
  min-height: 100vh;
`;

const Filters = styled.div`
  display: flex;
  div {
    position: relative;
    background: #5b5b5b;
    padding: 4px 40px;
    color: #fff;
    border-radius: 16px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  svg {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-10px, -50%);
  }
`;

const Button = styled.button`
  width: 100%;
  background: #2f77d6;
  color: #fff;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 2em;
  border: 1px solid #7aaff4;
  cursor: pointer;
  margin: 20px 0;
  &:hover {
    opacity: 0.8;
  }
`;

const defaultEdit = {
  id: null,
  isNew: false,
  type: null,
  data: {},
};

const defaultFilter = {
  subjectId: null,
  subject: {},
};

const CreateQuestionsPage = ({ playerId, firestore }) => {
  const [edit, setEdit] = useState({ ...defaultEdit });
  const [filter, setFilter] = useState({ ...defaultFilter });

  const resetFilters = () => {
    setFilter(defaultFilter);
  };

  const resetEdit = () => {
    setEdit(defaultEdit);
  }

  useFirestoreConnect([
    {
      collection: 'subjects',
      ...(filter.subjectId ? { where: [firestore.FieldPath.documentId(), '==', filter.subjectId] } : {}),
    },
    {
      collection: 'questions',
      ...(filter.subjectId ? { where: ['subjectId', '==', filter.subjectId] } : {}),
    },
  ]);
  const subjects = useSelector(state => state.firestore.ordered.subjects);
  const questions = useSelector(state => state.firestore.ordered.questions);

  const getQuestion = (subjectId, points) => {
    const array = _.filter(questions, q => q.subjectId == subjectId);
    const item = _.find(array, i => i.points === points);
    return item;
  };


  console.log('questions', questions);

  const points = [100, 300, 600, 900, 1200];

  const getQuestionsArray = () => {
    const result = [];
    _.forEach(subjects, subject => {
      _.forEach(points, (p, index) => {
        const question = getQuestion(subject.id, p);
        result.push({
          key: question
            ? question.id
            : subject.id + index,
          question: question ? question.question : '',
          points: p,
          answer: question ? question.answer : '',
          subjectId: subject.id,
          subject: subject.name,
          subjectData: subject,
        })
      });
    });
    return result;
  };

  const getSubjectsArray = () => {
    return _.map(subjects, subject => {
      return {
        key: subject.id,
        ...subject,
      }
    })
  }

  const subjectsList = getSubjectsArray();
  const questionsList = getQuestionsArray();

  const handleEditConfirm = async () => {
    try {
      if (edit.type === 'subject') {
        if (edit.id) {
          const ref = await firestore.collection('subjects').doc(edit.id);
          if (ref.id) {
            await ref.update({ name: edit.data });
          }
        } else {
          await firestore.collection('subjects').doc().set({ name: edit.data });
        }
      } else {
        if (edit.isNew) {
          const response = await firestore.collection('questions').doc().set({ ...edit.data });
          console.log('response', response);
        } else {
          const ref = await firestore.collection('questions').doc(edit.id);
          if (ref.id) {
            await ref.update({ question: edit.question, answer: edit.answer });
          }
        }
      }
      message.success('Готово!');
    } catch (e) {
      message.error(e);
    }
    resetEdit();
  }

  const onQuestionSetEdit = (record, object) => {
    setEdit(prev => ({
      ...prev,
      id: record.key,
      isNew: !(record && record.id),
      type: 'question',
      data: {
        question: _.get(record, 'question', ''),
        answer: _.get(record, 'answer', ''),
        ...object,
      }
    }));
  }

  const onSubjectSetEdit = (record) => {
    setEdit({ id: record.id, type: 'subject', data: record.name })
  }

  const onDeleteSubject = async (id) => {
    try {
      const response = await firestore.collection('questions').where('subjectId', '==', id).get();
      const questions = _.get(response, 'docs', []);
      _.forEach(questions, q => q.ref.delete());
      const ref = firestore.collection('subjects').doc(id);
      if (ref) ref.delete();
      message.success('Удалено!');
    } catch (e) {
      message.error(e);
    }
  };

  const handleModalInputChange = (value, field) => {
    if (edit.type === 'subject') {
      setEdit(prev => ({ ...prev, data: value }));
    } else {
      setEdit(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
    }
  }

  return (
    <Root>
      <Link href="/">
        <a><FiHome size="48px" color="#000" /></a>
      </Link>
      <Modal
        title={edit.isNew ? 'Создать' : 'Править'}
        visible={!!edit.id || edit.isNew}
        onOk={() => handleEditConfirm()}
        confirmLoading={false}
        onCancel={() => resetEdit()}
      >
        {edit.type === 'question'
          ?
          (
            <>
              <Input placeholder="Вопрос" value={_.get(edit, 'data.question', '')} onChange={e => handleModalInputChange(e.target.value, 'question')} />
              <Input placeholder="Ответ" value={_.get(edit, 'data.answer', '')} onChange={e => handleModalInputChange(e.target.value, 'answer')} />
            </>
          )
          : <Input placeholder="Тема" value={_.get(edit, 'data', '')} onChange={e => handleModalInputChange(e.target.value)} />}
      </Modal>
      <h1>Темы</h1>

      <h4>Фильтр</h4>
      <Filters>
        {filter.subjectId
          ? <div onClick={() => resetFilters()}>
            {filter.subject.name}
            <FiTrash2 color="#fff" size="20px" />
          </div>
          : null
        }
      </Filters>
      <Table dataSource={subjectsList}>
        <Column title="Тема" dataIndex="name" key="name" />
        <Column
          title="Действия"
          key="action"
          render={(text, record) => (
            <span>
              <a onClick={() => onSubjectSetEdit(record)}>Править</a>
              &nbsp;

              <Popconfirm
                title="Удалить тему и все вопросы к ней?"
                onConfirm={() => onDeleteSubject(record.id)}
                onCancel={() => { }}
                okText="Да"
                cancelText="Нет"
              >
                <a>Удалить</a>
              </Popconfirm>

              &nbsp;
              <a onClick={() => setFilter({ subjectId: record.id, subject: record })}>Фильтр</a>
            </span>
          )}
        />
      </Table>
      <Button onClick={() => setEdit(prev => ({ ...prev, isNew: true, type: 'subject', data: '' }))}>Добавить тему</Button>

      <h1>Вопросы</h1>
      <Table dataSource={questionsList}>
        <ColumnGroup title="">
          <Column title="Вопрос" dataIndex="question" key="question" />
          <Column title="Ответ" dataIndex="answer" key="answer" />
        </ColumnGroup>
        <Column title="Очки" dataIndex="points" key="points" />
        <Column title="Тема" dataIndex="subject" key="subject" />
        <Column
          title="Действия"
          key="action"
          render={(text, record) => (
            <span>
              <a onClick={() => onQuestionSetEdit(record, { points: text.points, subjectId: text.subjectId })}>Править</a>
            </span>
          )}
        />
      </Table>
    </Root>
  );
};

export default React.memo(CreateQuestionsPage, (prev, next) => _.isEqual(prev, next));