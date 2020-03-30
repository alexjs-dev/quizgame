import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 80vw;
  min-height: 80vh;
  border: 1px solid #fff;
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-gap: 20px;
  padding: 24px;
`;


const CardsPlayerLayout = ({ children }) => {
  return (
    <CardContainer>
      {children}
    </CardContainer>
  );
};

export default CardsPlayerLayout;
