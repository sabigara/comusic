import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import useAudioAPI from '../hooks/useAudioAPI';
import { PlaybackStatus } from '../common/Enums';
import { play, pause, stop, updateTime } from '../actions/playback';
import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const noop = () => {};

const PlaybackControls: React.FC = () => {
  const state = useSelector(
    (state: any) => state.playback,
    (prev, current) => prev.status === current.status
  );
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    async function _() {
      switch(state.status) {
        case PlaybackStatus.Playing:
          await audioAPI.play(state.time);
          dispatch(stop());
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
  })

  useEffect(() => {
    switch(state.status) {
      case PlaybackStatus.Playing:
        const interval = setInterval(() => {
          dispatch(updateTime(audioAPI.getSecondsElapsed()));
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
        setActive={noop}
        onClick={() => {
          dispatch(stop());
        }}
      >
        <IconImg src={StopIcon} alt="stop"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={state.status === PlaybackStatus.Pausing}
        setActive={noop}
        onClick={() => {
          dispatch(pause());
        }}
      >
        <IconImg src={PauseIcon} alt="pause"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={state.status === PlaybackStatus.Playing}
        setActive={noop}
        onClick={() => {
          dispatch(play());
        }}
      >
        <IconImg src={PlayIcon} alt="play"/>
      </ToolBarItem>

    </ToolBackItemContainer>
  )
};

const IconImg = styled(Img)`
  width: 16px;
  height: 16px;
`;

export default PlaybackControls;
