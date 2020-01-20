import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import { 
  loadActiveTakeRequest,
  loadActiveTakeSuccess,
} from '../actions/tracks';
import useAudioAPI from '../hooks/useAudioAPI';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';

type Props = {
  trackId: string,
}

const Track: React.FC<Props> = ({ trackId }) => {
  const track = useSelector((state: any) => {
      return state.tracks.byId[trackId];
    }, (prev, current) => {
      return prev.activeTake === current.activeTake;
    }
  );
  const activeTake = useSelector((state: any) => {
    const activeTakeId = state.tracks.byId[trackId].activeTake;
    return state.takes.byId[activeTakeId];
  });
  const file = useSelector((state: any) => {
    return state.files.byId[activeTake.file];
  });

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    const trackAPI = audioAPI.loadTrack(track.id, track.name);
    trackAPI.setVolume(track.volume);
    trackAPI.setPan(track.pan);
    // shouldPlay ? trackAPI.unMute() : trackAPI.mute();
    
    return () => {
      trackAPI.release();
    }
  });

  useEffect(() => {
    async function _() {
      dispatch(loadActiveTakeRequest(track.id));
      await audioAPI.tracks[track.id]!.loadFile(file.uri);
      dispatch(loadActiveTakeSuccess(track.id));
    }
    _();
  }, [dispatch, audioAPI.tracks, file.uri, track.id]);

  return(
    <TrackWrapper>
      <TrackPanel trackId={trackId}/>
      <SeparatorV/>
      <TakeList trackId={trackId}/>
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