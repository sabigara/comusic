import { combineReducers } from 'redux';

import loading, { LoadingState } from './loading';
import playback, { PlaybackState } from './playback';
import tracks, { TrackCombinedState } from './tracks';
import takes, { TakeCombinedState } from './takes';
import files, { FileCombinedState } from './files';

export type RootState = {
  loading: LoadingState;
  playback: PlaybackState;
  tracks: TrackCombinedState;
  takes: TakeCombinedState;
  files: FileCombinedState;
};

const getReducers = () => {
  const reducers = combineReducers({
    loading,
    playback,
    tracks,
    takes,
    files,
  });
  return reducers;
};

export default getReducers;
