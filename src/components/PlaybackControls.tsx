import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import { PlaybackStatus } from '../common/Enums';
import { play, pause, stop, updateTime } from '../actions/playback';
import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const PlaybackControls: React.FC = () => {
  const state = useSelector(
    (state: RootState) => state.playback,
    (prev, current) => prev.status === current.status,
  );

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    async function _(): Promise<void> {
      switch (state.status) {
        case PlaybackStatus.Playing:
          audioAPI.play(state.time);
          break;
        case PlaybackStatus.Pausing:
          audioAPI.stop();
          break;
        case PlaybackStatus.Stopping:
          audioAPI.stop();
          break;
        default:
          break;
      }
    }
    _();
  }, [audioAPI, state.status, state.time]);

  useEffect(() => {
    switch (state.status) {
      case PlaybackStatus.Playing:
        const interval = setInterval(() => {
          dispatch(updateTime(audioAPI.secondsElapsed));
        }, 20);
        return () => clearInterval(interval);
      case PlaybackStatus.Stopping:
        dispatch(updateTime(0));
        break;
      default:
        break;
    }
  }, [audioAPI, dispatch, state]);

  return (
    <ToolBackItemContainer>
      <ToolBarItem
        isActive={state.status === PlaybackStatus.Stopping}
        onClick={() => {
          dispatch(stop());
        }}
      >
        <IconImg src={StopIcon} alt="stop" />
      </ToolBarItem>
      <ToolBarItem
        isActive={state.status === PlaybackStatus.Pausing}
        onClick={() => {
          dispatch(pause());
        }}
      >
        <IconImg src={PauseIcon} alt="pause" />
      </ToolBarItem>
      <ToolBarItem
        isActive={state.status === PlaybackStatus.Playing}
        onClick={() => {
          dispatch(play());
        }}
      >
        <IconImg src={PlayIcon} alt="play" />
      </ToolBarItem>
    </ToolBackItemContainer>
  );
};

const IconImg = styled(Img)`
  width: 16px;
  height: 16px;
`;

export default PlaybackControls;
