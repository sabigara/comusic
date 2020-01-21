import React from 'react';
import styled from 'styled-components';

const More: React.FC = () => {
  return (
    <Wrapper>
      <Dot />
      <Dot />
      <Dot />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 17px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 3px;
  height: 3px;
`;

export default More;
