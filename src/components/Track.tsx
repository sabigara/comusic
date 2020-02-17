import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';

type Props = {
  trackId: string;
};

const Track: React.FC<Props> = ({ trackId }) => {
  const track = useSelector(
    (state: RootState) => {
      return state.tracks.byId[trackId];
    },
    (prev, current) => {
      return prev.activeTake === current.activeTake;
    },
  );
  const audioAPI = useAudioAPI();

  useEffect(() => {
    const trackAPI = audioAPI.getTrack(track.id);
    return () => {
      trackAPI?.release();
    };
  }, [audioAPI, track.id]);

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
