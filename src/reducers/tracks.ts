import { combineReducers } from 'redux';

import { InstIcon } from '../common/Enums';
import { ActionUnionType, ActionTypeName } from '../actions/tracks';

const initialState = {
  id: '',
  name: '',
  volume: 0,
  pan: 0,
  mute: false,
  solo: false,
  icon: InstIcon.Drums,
  activeTake: '',
  song: '',
  version: '',
  player: '',
};

export type TrackState = typeof initialState;

function track(
  state: TrackState = initialState,
  action: ActionUnionType,
): TrackState {
  switch (action.type) {
    case ActionTypeName.CHANGE_VOLUME:
      return { ...state, volume: action.payload.volume };
    case ActionTypeName.CHANGE_PAN:
      return { ...state, pan: action.payload.pan };
    case ActionTypeName.CHANGE_NAME:
      return { ...state, name: action.payload.name };
    case ActionTypeName.CHANGE_ACTIVE_TAKE:
      return { ...state, activeTake: action.payload.activeTakeId };
    case ActionTypeName.MUTE_ON:
      return { ...state, mute: true };
    case ActionTypeName.MUTE_OFF:
      return { ...state, mute: false };
    case ActionTypeName.SOLO_ON:
      return { ...state, solo: true };
    case ActionTypeName.SOLO_OFF:
      return { ...state, solo: false };
    default:
      return state;
  }
}

type ByIdState = {
  [id: string]: TrackState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.CHANGE_VOLUME:
    case ActionTypeName.CHANGE_PAN:
    case ActionTypeName.CHANGE_NAME:
    case ActionTypeName.CHANGE_ACTIVE_TAKE:
    case ActionTypeName.MUTE_ON:
    case ActionTypeName.MUTE_OFF:
    case ActionTypeName.SOLO_ON:
    case ActionTypeName.SOLO_OFF:
      return {
        ...state,
        [action.id]: track(state[action.id], action),
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    default:
      return state;
  }
}

export type TrackCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
