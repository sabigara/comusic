import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import PlayBackControls from './PlayBackControls';

const ToolBar: React.FC = () => {
  return (
    <Wrapper>
      <PlayBackControls/>
    </Wrapper>
  )
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    ${Color.ToolBar.Background.Highest},
    ${Color.ToolBar.Background.Lowest}
  );
  height: 70px;
`;

export default ToolBar;
