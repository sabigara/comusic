import { combineReducers } from 'redux';

import { InstIcon } from '../common/Enums';

type Track = {
  id: string,
  name: string,
  volume: number,
  pan: number,
  mute: boolean,
  solo: boolean,
  icon: InstIcon,
  activeTake: string,
  song: string,
  version: string,
  player: string,
}

const initialState = {}

function track(state: Track, action) {
  switch (action.type) {
    case 'CHANGE_VOLUME':
      return { ...state, volume: action.payload.volume };
    case 'CHANGE_PAN':
      return { ...state, pan: action.payload.pan };
    case 'CHANGE_NAME':
      return { ...state, name: action.payload.name };
    case 'CHANGE_ACTIVE_TAKE':
      return { ...state, activeTake: action.payload.activeTakeId };
    case 'MUTE_ON':
      return { ...state, mute: true };
    case 'MUTE_OFF':
      return { ...state, mute: false };
    case 'SOLO_ON':
      return { ...state, solo: true };
    case 'SOLO_OFF':
      return { ...state, solo: false };
    default:
      return state;
  }}

function byId(
  state: typeof initialState = initialState,
  action: any
) {
  switch (action.type) {
    case 'CHANGE_VOLUME':
    case 'CHANGE_PAN':
    case 'CHANGE_NAME':
    case 'CHANGE_ACTIVE_TAKE':
    case 'MUTE_ON':
    case 'MUTE_OFF':
    case 'SOLO_ON':
    case 'SOLO_OFF':
      return {
        ...state,
        [action.id]: track(state[action.id], action),
      };
    default:
      return state;
  }
}

function allIds(
  state: string[] = [],
  action: any
) {
  switch (action.type) {
    case 'ADD_TRACK':
      return [ ...state, action.id ]
    default:
      return state;
    };
}

export default combineReducers({
  byId,
  allIds,
});
