import styled, { css } from 'styled-components';

export const Root = styled.div`
  padding: 10px;
  min-height: 100vh;
  min-width: 100vw;
  background: #1E22CC;
  display: flex;
  flex-direction: column;
  ${props => props.centered ? css`
    justify-content: center;
    align-items: center;
    div {
      font-size: 2.2em;
    }
  `: ''}
`;

export const Actions = styled.div`
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;
export const Action = styled.button`
  width: 100%;
  height: auto;
  border: 1px solid #fff;
  outline: 0;
  padding: 20px 0;
  background: ${props => props.disabled ? '#c3c3c3' : props.background ? props.background : '#ffc928'};
  color: ${props => props.disabled ? '#f1f1f1' : props.color ? props.color : '#fff'};
  font-size: 0.7em;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  &:hover {
    opacity: 0.8;
  }
`;

export const Field = styled.div`
  min-height: 100px;
  width: 100%;
  border: 1px solid #fff;
  color: #fff;
  font-size: ${props => props.large ? '5em' : '1.4em'};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.background ? props.background : props.success ? '#45e031' : 'transparent'};
  cursor: pointer;
  padding: 6px;
  &:hover {
    opacity: 0.8;
  }
`;

export const PlayersRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: ${props => props.count ? `repeat(${props.count + 1}, 1fr);` : 'repeat(6, 1fr)'};
`;

export const QuestionsTable = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 25vw repeat(5, 1fr);
`;

export const FieldWrapped = styled(Field)`
  display: flex;
  flex-direction: column;
  background: ${props => props.background ? props.background : props.success ? '#45e031' : 'transparent'};
  div {
    color: #fff;
    font-size: 1.7em;
  }
`;

export const ControlPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  transform: translateY(-50%);
  background: #e52b2b;
  cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  button {
    background: #e52b2b;
    border: 0;
    outline: 0;
    width: 100%;
    font-size: 2em;
    color: #fff;
  }
`;