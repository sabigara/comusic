import { Reducer } from 'redux';
import { Actions } from '../actions/playback';
import { PlaybackStatus } from '../common/Enums';

const initialState = {
  status: PlaybackStatus.Stopping,
  time: 0,
}

const playback: Reducer = (
  state: typeof initialState = initialState,
  action: any
) => {
  switch (action.type) {
    case 'PLAY':
      return { ...state, status: PlaybackStatus.Playing };
    case 'PAUSE':
      return { ...state, status: PlaybackStatus.Pausing };
    case 'STOP':
      return { ...state, status: PlaybackStatus.Stopping };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload.secondsElapsed };
    default:
      return state;
  }
}

export default playback;