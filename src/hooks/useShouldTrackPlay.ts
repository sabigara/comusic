import { useMemo } from 'react';
import { useSelector } from 'react-redux';


export default (trackId: string) => {
  const trackList = useSelector(
    (state: any) => state.trackList
  );
  
  const soloedTracks = trackList.filter(track => track.solo === true).map(track => track.id);
  const mutedTracks = trackList.filter(track => track.mute === true).map(track => track.id);

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
  }, [trackId, soloedTracks, mutedTracks])
  return shouldPlay;
}