import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import PlaybackControls from './PlaybackControls';

const ToolBar: React.FC = () => {
  return (
    <Wrapper>
      <PlaybackControls/>
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
