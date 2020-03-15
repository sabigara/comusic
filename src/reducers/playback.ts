import { Reducer } from 'redux';
import { ActionUnionType, ActionTypeName } from '../actions';
import { PlaybackStatus } from '../common/Domain';

const initialState = {
  status: PlaybackStatus.Stopping,
  masterVolume: 0.7,
};

export type PlaybackState = typeof initialState;

const playback: Reducer = (
  state: PlaybackState = initialState,
  action: ActionUnionType,
): PlaybackState => {
  switch (action.type) {
    case ActionTypeName.Playback.PLAY:
      return { ...state, status: PlaybackStatus.Playing };
    case ActionTypeName.Playback.PAUSE:
      return { ...state, status: PlaybackStatus.Pausing };
    case ActionTypeName.Playback.STOP:
      return { ...state, status: PlaybackStatus.Stopping };
    case ActionTypeName.Playback.CHANGE_MASTER_VOLUME:
      return { ...state, masterVolume: action.payload.masterVolume };
    default:
      return state;
  }
};

export default playback;
