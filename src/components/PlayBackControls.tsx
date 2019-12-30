import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { PlaybackState } from '../common/Enums';
import { play, pause, stop } from '../actions/playback';
import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const noop = () => {};

const PlaybackControls: React.FC = () => {
  const playbackState = useSelector((state: any) => state.playback);
  const dispatch = useDispatch()

  return (
    <ToolBackItemContainer>
      <ToolBarItem
        isActive={playbackState === PlaybackState.Stopping}
        setActive={noop}
        onClick={() => {
          dispatch(stop());
        }}
      >
        <IconImg src={StopIcon} alt="stop"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={playbackState === PlaybackState.Pausing}
        setActive={noop}
        onClick={() => {
          dispatch(pause());
        }}
      >
        <IconImg src={PauseIcon} alt="pause"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={playbackState === PlaybackState.Playing}
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
