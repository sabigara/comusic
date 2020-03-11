import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import PlaybackControls from './PlaybackControls';
import Clock from './Clock';
import MasterVolFader from './MasterVolFader';
import Notification from './Notification';

const ToolBar: React.FC = () => {
  return (
    <Wrapper>
      <MasterVolFaderWrapper>
        <MasterVolFader />
      </MasterVolFaderWrapper>

      <ClockWrapper>
        <Clock />
      </ClockWrapper>
      <PlaybackWrapper>
        <PlaybackControls />
      </PlaybackWrapper>
      <NotificationWrapper>
        <Notification />
      </NotificationWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(
    ${Color.ToolBar.Background.Highest},
    ${Color.ToolBar.Background.Lowest}
  );
  height: 70px;
`;

const MasterVolFaderWrapper = styled.div`
  width: 150px;
`;

const ClockWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%);
`;

const PlaybackWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(calc(-50% - 40px - 150px));
`;

const NotificationWrapper = styled.div`
  position: absolute;
  right: 2%;
`;

export default ToolBar;
