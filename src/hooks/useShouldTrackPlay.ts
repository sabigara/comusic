import { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { RootState } from '../reducers';

export default (trackId: string): boolean => {
  const soloedTracks = useSelector((state: RootState) => {
    return state.tracks.allIds
      .map((id) => state.tracks.byId[id])
      .filter((track) => track.isSoloed === true)
      .map((track) => track.id);
  }, shallowEqual);
  const mutedTracks = useSelector((state: RootState) => {
    return state.tracks.allIds
      .map((id) => state.tracks.byId[id])
      .filter((track) => track.isMuted === true)
      .map((track) => track.id);
  }, shallowEqual);

  const shouldPlay = useMemo(() => {
    let _shouldPlay: boolean;
    // if there are solo tracks, only they should play.
    if (soloedTracks.length > 0) {
      _shouldPlay = false;
      if (soloedTracks.indexOf(trackId) > -1) {
        _shouldPlay = true;
      }
    } else {
      // play all tracks except any muted tracks.
      _shouldPlay = true;
      if (mutedTracks.indexOf(trackId) > -1) {
        _shouldPlay = false;
      }
    }
    return _shouldPlay;
  }, [trackId, soloedTracks, mutedTracks]);
  return shouldPlay;
};
