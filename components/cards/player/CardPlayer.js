import React from 'react';
import styled, { css } from 'styled-components';
import omitBy from 'lodash/omitBy';
import includes from 'lodash/includes';

const Card = styled.div`
  position: relative;
  ${({ self }) => self
    ? css`
    ::before {
      z-index: 1;
      border-left: 10px solid #d54b4f;
      top: 0;
      left: 100%;
      border-top: 9px solid transparent;
      border-bottom: 10px solid transparent;
      width: 0;
      height: 0;
      content: '';
      position: absolute;
    }
    ::after {
      z-index: 1;
      background: #d54b4f;
      top: 0;
      left: 0;
      border-top: 9px solid transparent;
      border-bottom: 10px solid transparent;
      width: 100%;
      height: 30px;
      color: #fff;
      font-size: 20px;
      content: 'ВЫ';
      position: absolute;
    }
    `
    : ''};
  width: 150px;
  height: 300px;
  background: ${props => props.disabled ? '#c1c1c1' : props.background ? props.background : '#f1f1f1'};
  border: ${props => props.color ? `1px solid ${props.color}` : '1px solid #c3c3c3'};
  border-radius: 6px;
  color: ${props => props.disabled ? '#f1f1f1' : props.color ? props.color : '#000'};
  font-size: 2.8em;
  padding: 6px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.8;
    ${props => props.background || props.disabled ? '' : css`
      background: #000;
    `};
    ${props => props.color || props.disabled ? '' : css`
      color: #fff;
    `};
  }
  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const CardPlayer = (props) => {
  const { children } = props;
  return <Card {...omitBy(props, (_, key) => includes('children', key))}>{children}</Card>
}

export default CardPlayer;
