import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { PlaybackStatus } from '../common/Enums';
import Color from '../common/Color';
import { RootState } from '../reducers';
import {
  loadActiveTakeRequest,
  loadActiveTakeSuccess,
} from '../actions/tracks';
import useLoading from '../hooks/useLoading';
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
  const activeTake = useSelector((state: RootState) => {
    const activeTakeId = state.tracks.byId[trackId].activeTake;
    return state.takes.byId[activeTakeId];
  });
  const file = useSelector((state: RootState) => {
    if (!activeTake) {
      return;
    }
    return state.files.byId[activeTake.fileId];
  });
  const playback = useSelector(
    (state: RootState) => {
      return state.playback;
    },
    (prev, current) => {
      return prev.status === current.status;
    },
  );
  const loadingTake = useLoading('LOAD_ACTIVE_TAKE', trackId);
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    const trackAPI = audioAPI.loadTrack(track.id, track.name);
    return () => {
      trackAPI.release();
    };
  }, [audioAPI, track.id, track.name]);

  useEffect(() => {
    const trackAPI = audioAPI.tracks[track.id];
    trackAPI.setVolume(track.volume);
    trackAPI.setPan(track.pan);
    // shouldPlay ? trackAPI.unMute() : trackAPI.mute();
  }, [audioAPI, track.id, track.name, track.pan, track.volume]);

  useEffect(() => {
    const trackAPI = audioAPI.tracks[trackId];
    trackAPI.stop();
    if (loadingTake) return;
    if (playback.status === PlaybackStatus.Playing) {
      if (!trackAPI.isPlaying) {
        trackAPI.play(playback.time);
      }
    }
  }, [audioAPI.tracks, loadingTake, playback.status, playback.time, trackId]);

  useEffect(() => {
    async function _() {
      if (!file) {
        return;
      }
      dispatch(loadActiveTakeRequest(track.id));
      await audioAPI.tracks[track.id].loadFile(file.url);
      dispatch(loadActiveTakeSuccess(track.id));
    }
    _();
  }, [dispatch, audioAPI.tracks, file, track.id]);

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
