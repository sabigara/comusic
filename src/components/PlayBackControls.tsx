import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { play, pause, stop } from '../actions/playback';
import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const noop = () => {};

const PlayBackControls: React.FC = () => {
  const playbackState = useSelector((state: any) => state.playback);
  const dispatch = useDispatch()

  return (
    <ToolBackItemContainer>
      <ToolBarItem
        isActive={playbackState === 'Stopping'}
        setActive={noop}
        onClick={() => {
          dispatch(stop());
        }}
      >
        <IconImg src={StopIcon} alt="stop"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={playbackState === 'Pausing'}
        setActive={noop}
        onClick={() => {
          dispatch(pause());
        }}
      >
        <IconImg src={PauseIcon} alt="pause"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={playbackState === 'Playing'}
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

export default PlayBackControls;
