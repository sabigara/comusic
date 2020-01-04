import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import { loadTrackStart, loadTrackSuccess } from '../actions/trackList';
import useAudioAPI from '../hooks/useAudioAPI';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';


type Props = {
  trackId: string,
}

const Track: React.FC<Props> = ({ trackId }) => {
  const state = useSelector((state: any) => {
    const track = state.trackList.filter((track: any) => track.id === trackId);
      return track ? track[0] : null
    }, (prev, current) => {
      return prev.id === current.id 
        && prev.activeTakeId === current.activeTakeId
        && prev.isTrackLoading === current.isTrackLoading;
    }
  );

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    dispatch(loadTrackStart(trackId));
    audioAPI.loadTrack({
          name: state.name,
          id: state.id,
    });
    dispatch(loadTrackSuccess(trackId));
  }, [audioAPI, state.name, state.id, dispatch, trackId]);

  if (state.isTrackLoading) { return <div></div> }

  return(
    <TrackWrapper>
      <TrackPanel trackId={trackId}/>
      <SeparatorV/>
      <TakeList
        trackId={trackId}
      />
      <Spacer/>
      <SeparatorV/>
    </TrackWrapper>
  )
}

const TrackWrapper = styled.div`
  height: 100%;
  display: flex;
`

const SeparatorV = styled.div`
  width: 1px;
  background-color: #777;
`

const Spacer = styled.div`
  width: 5px;
  background-color: ${Color.Track.Background}
`

export default Track;