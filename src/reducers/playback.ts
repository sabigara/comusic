import { Reducer } from 'redux';
import { Actions } from '../actions/playback';
import { PlaybackState } from '../common/Enums';

const initialState = PlaybackState.Stopping;

const playback: Reducer = (
  state: typeof initialState = initialState,
  action: Actions
) => {
  switch (action.type) {
    case 'PLAY':
      return PlaybackState.Playing;
    case 'PAUSE':
      return PlaybackState.Pausing;
    case 'STOP':
      return PlaybackState.Stopping;
    default:
      return state;
  }
}

export default playback;