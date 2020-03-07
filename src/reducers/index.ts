import { combineReducers } from 'redux';

import loading, { LoadingState } from './loading';
import playback, { PlaybackState } from './playback';
import profile, { ProfileState } from './profiles';
import studios, { StudioCombinedState } from './studios';
import songs, { SongCombinedState } from './songs';
import versions, { VersionCombinedState } from './versions';
import tracks, { TrackCombinedState } from './tracks';
import takes, { TakeCombinedState } from './takes';
import files, { FileCombinedState } from './files';

export type RootState = {
  loading: LoadingState;
  playback: PlaybackState;
  profile: ProfileState;
  studios: StudioCombinedState;
  songs: SongCombinedState;
  versions: VersionCombinedState;
  tracks: TrackCombinedState;
  takes: TakeCombinedState;
  files: FileCombinedState;
};

const getReducers = () => {
  const reducers = combineReducers({
    loading,
    playback,
    profile,
    studios,
    songs,
    versions,
    tracks,
    takes,
    files,
  });
  return reducers;
};

export default getReducers;
