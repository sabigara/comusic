import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import { PlaybackStatus } from '../common/Domain';
import { play, pause, stop, updateTime } from '../actions/playback';
import Img from '../atoms/Img';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';
import PlayIcon from '../icons/Play.png';
import StopIcon from '../icons/Stop.png';
import PauseIcon from '../icons/Pause.png';

const PlaybackControls: React.FC = () => {
  const playback = useSelector(
    (state: RootState) => state.playback,
    (prev, current) => prev.status === current.status,
  );

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  useEffect(() => {
    switch (playback.status) {
      case PlaybackStatus.Playing:
        audioAPI.play(playback.time);
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
  }, [audioAPI, playback.status, playback.time]);

  useEffect(() => {
    switch (playback.status) {
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
  }, [audioAPI, dispatch, playback]);

  const onStopClick = () => dispatch(stop());
  const onPauseClick = () => dispatch(pause());
  const onPlayClick = () => dispatch(play());

  return (
    <ToolBackItemContainer>
      <ToolBarItem
        id="stop-button"
        isActive={playback.status === PlaybackStatus.Stopping}
        onClick={onStopClick}
      >
        <IconImg src={StopIcon} alt="stop" />
      </ToolBarItem>
      <ToolBarItem
        id="pause-button"
        isActive={playback.status === PlaybackStatus.Pausing}
        onClick={onPauseClick}
      >
        <IconImg src={PauseIcon} alt="pause" />
      </ToolBarItem>
      <ToolBarItem
        id="play-button"
        isActive={playback.status === PlaybackStatus.Playing}
        onClick={onPlayClick}
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
