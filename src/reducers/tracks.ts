import { combineReducers } from 'redux';

import { InstIcon } from '../common/Enums';
import { ActionUnionType, ActionTypeName } from '../actions/tracks';

const initialState = {
  id: '',
  name: '',
  volume: 0,
  pan: 0,
  isMuted: false,
  isSoloed: false,
  icon: InstIcon.Drums,
  activeTake: '',
  song: '',
  versionId: '',
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
      return { ...state, isMuted: true };
    case ActionTypeName.MUTE_OFF:
      return { ...state, isMuted: false };
    case ActionTypeName.SOLO_ON:
      return { ...state, isSoloed: true };
    case ActionTypeName.SOLO_OFF:
      return { ...state, isSoloed: false };
    case ActionTypeName.UPLOAD_TAKE_FILE_SUCCESS:
      return { ...state, activeTake: action.payload.take.id };
    default:
      return state;
  }
}

export type TrackByIdState = {
  [id: string]: TrackState;
};

function byId(
  state: TrackByIdState = {},
  action: ActionUnionType,
): TrackByIdState {
  switch (action.type) {
    case ActionTypeName.CHANGE_VOLUME:
    case ActionTypeName.CHANGE_PAN:
    case ActionTypeName.CHANGE_NAME:
    case ActionTypeName.CHANGE_ACTIVE_TAKE:
    case ActionTypeName.MUTE_ON:
    case ActionTypeName.MUTE_OFF:
    case ActionTypeName.SOLO_ON:
    case ActionTypeName.SOLO_OFF:
    case ActionTypeName.UPLOAD_TAKE_FILE_SUCCESS:
      return {
        ...state,
        [action.id]: track(state[action.id], action),
      };
    case ActionTypeName.ADD_TRACKS:
      return {
        ...state,
        ...action.payload.byId,
      };
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.tracks.byId,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.ADD_TRACKS:
      return state.concat(action.payload.allIds);
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.tracks.allIds);
    default:
      return state;
  }
}

export type TrackCombinedState = {
  byId: TrackByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
