import React from 'react';
import styled from 'styled-components';

import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const noop = () => {};

type Props = {
  playing: boolean,
  stopping: boolean,
  pausing: boolean,
  setPlaying: Function,
  setStopping: Function,
  setPausing: Function,
}

const PlayBackControls: React.FC<Props> = (props) => {
  const {
    playing, pausing, stopping,
    setPlaying, setStopping, setPausing,
  } = props;

  return (
    <ToolBackItemContainer>
      <ToolBarItem
        isActive={stopping}
        setActive={noop}
        onClick={() => {
          setPlaying(false);
          setPausing(false);
          setStopping(true);
        }}
      >
        <IconImg src={StopIcon} alt="stop"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={pausing}
        setActive={noop}
        onClick={() => {
          setPlaying(false);
          setPausing(true);
          setStopping(false);
        }}
      >
        <IconImg src={PauseIcon} alt="pause"/>
      </ToolBarItem>
      <ToolBarItem
        isActive={playing}
        setActive={noop}
        onClick={() => {
          setPlaying(true);
          setPausing(false);
          setStopping(false);
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
