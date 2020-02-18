import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import { useRestartTrack } from '../hooks/tracks';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';

type Props = {
  trackId: string;
};

const Track: React.FC<Props> = ({ trackId }) => {
  useRestartTrack(trackId);
  return (
    <TrackWrapper>
      <TrackPanel trackId={trackId} />
      <SeparatorV />
      <TakeList trackId={trackId} />
      <Spacer />
      <SeparatorV />
    </TrackWrapper>
  );
};

const TrackWrapper = styled.div`
  height: 100%;
  display: flex;
`;

const SeparatorV = styled.div`
  width: 1px;
  background-color: #777;
`;

const Spacer = styled.div`
  width: 5px;
  background-color: ${Color.Track.Background};
`;

export default Track;
