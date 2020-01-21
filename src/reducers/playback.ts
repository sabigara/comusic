import { Reducer } from 'redux';
import { ActionUnionType, ActionTypeName } from '../actions/playback';
import { PlaybackStatus } from '../common/Enums';

const initialState = {
  status: PlaybackStatus.Stopping,
  time: 0,
  masterVolume: 0,
};

export type PlaybackState = typeof initialState;

const playback: Reducer = (
  state: PlaybackState = initialState,
  action: ActionUnionType,
): PlaybackState => {
  switch (action.type) {
    case ActionTypeName.PLAY:
      return { ...state, status: PlaybackStatus.Playing };
    case ActionTypeName.PAUSE:
      return { ...state, status: PlaybackStatus.Pausing };
    case ActionTypeName.STOP:
      return { ...state, status: PlaybackStatus.Stopping };
    case ActionTypeName.UPDATE_TIME:
      return { ...state, time: action.payload.secondsElapsed };
    case ActionTypeName.CHANGE_MASTER_VOLUME:
      return { ...state, masterVolume: action.payload.masterVolume };
    default:
      return state;
  }
};

export default playback;
