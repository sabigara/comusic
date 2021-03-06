import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import { PlaybackStatus } from '../common/Domain';
import { play, pause, stop } from '../actions/playback';
import ToolBarItem from '../atoms/ToolBarItem';
import ToolBackItemContainer from '../atoms/ToolBarItemContainer';

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
        audioAPI.play();
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
  }, [audioAPI, playback.status]);

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
        <Icon icon={IconNames.STOP} iconSize={Icon.SIZE_LARGE} />
      </ToolBarItem>
      <ToolBarItem
        id="pause-button"
        isActive={playback.status === PlaybackStatus.Pausing}
        onClick={onPauseClick}
      >
        <Icon icon={IconNames.PAUSE} iconSize={Icon.SIZE_LARGE} />
      </ToolBarItem>
      <ToolBarItem
        id="play-button"
        isActive={playback.status === PlaybackStatus.Playing}
        onClick={onPlayClick}
      >
        <Icon icon={IconNames.PLAY} iconSize={Icon.SIZE_LARGE} />
      </ToolBarItem>
    </ToolBackItemContainer>
  );
};

export default PlaybackControls;
