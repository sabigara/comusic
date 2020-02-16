import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PlaybackStatus } from '../common/Enums';
import { RootState } from '../reducers';
import { play, stop } from '../actions/playback';

const KeyBindings: React.FC = () => {
  const status = useSelector((state: RootState) => state.playback.status);
  const dispatch = useDispatch();
  const space = React.useCallback(
    (e) => {
      if (e.keyCode === 32) {
        e.preventDefault();
        switch (status) {
          case PlaybackStatus.Stopping:
            dispatch(play());
            return;
          case PlaybackStatus.Pausing:
            dispatch(play());
            return;
          case PlaybackStatus.Playing:
            dispatch(stop());
            return;
        }
      }
    },
    [status, dispatch],
  );
  useEffect(() => {
    window.addEventListener('keydown', space);
    return () => {
      window.removeEventListener('keydown', space);
    };
  });

  return null;
};

export default KeyBindings;
