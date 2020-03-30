import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #2d2d2d;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;


const MainLayout = ({ children }) => {
  return (
    <Root>
      {children}
    </Root>
  );
};

export default MainLayout;
