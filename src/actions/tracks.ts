import { TrackByIdState } from '../reducers/tracks';
import {
  uploadTakeFileSuccess,
  UPLOAD_TAKE_FILE_SUCCESS,
  deleteTakeSuccess,
  DELETE_TAKE_SUCCESS,
} from './takes';
import {
  fetchVerContentsSuccess,
  FETCH_VER_CONTENTS_SUCCESS,
} from './versions';

const ADD_TRACKS = 'ADD_TRACKS' as const;
const CHANGE_VOLUME = 'CHANGE_VOLUME' as const;
const CHANGE_PAN = 'CHANGE_PAN' as const;
const CHANGE_NAME = 'CHANGE_NAME' as const;
const CHANGE_ACTIVE_TAKE = 'CHANGE_ACTIVE_TAKE' as const;
const MUTE_ON = 'MUTE_ON' as const;
const MUTE_OFF = 'MUTE_OFF' as const;
const SOLO_ON = 'SOLO_ON' as const;
const SOLO_OFF = 'SOLO_OFF' as const;
const LOAD_TRACK_REQUEST = 'LOAD_TRACK_REQUEST' as const;
const LOAD_TRACK_SUCCESS = 'LOAD_TRACK_SUCCESS' as const;
const LOAD_ACTIVE_TAKE_REQUEST = 'LOAD_ACTIVE_TAKE_REQUEST' as const;
const LOAD_ACTIVE_TAKE_SUCCESS = 'LOAD_ACTIVE_TAKE_SUCCESS' as const;

export const ActionTypeName = {
  ADD_TRACKS,
  CHANGE_VOLUME,
  CHANGE_PAN,
  CHANGE_NAME,
  CHANGE_ACTIVE_TAKE,
  MUTE_ON,
  MUTE_OFF,
  SOLO_ON,
  SOLO_OFF,
  LOAD_TRACK_REQUEST,
  LOAD_TRACK_SUCCESS,
  LOAD_ACTIVE_TAKE_REQUEST,
  LOAD_ACTIVE_TAKE_SUCCESS,
  UPLOAD_TAKE_FILE_SUCCESS,
  // From outer modules.
  FETCH_VER_CONTENTS_SUCCESS,
  DELETE_TAKE_SUCCESS,
};

export const addTracks = (byId: TrackByIdState, allIds: string[]) => {
  return {
    type: ADD_TRACKS,
    payload: {
      byId: byId,
      allIds: allIds,
    },
  };
};

export const changeVolume = (trackId: string, volume: number) => {
  return {
    type: CHANGE_VOLUME,
    id: trackId,
    payload: {
      volume: volume,
    },
  };
};

export const changePan = (trackId: string, pan: number) => {
  return {
    type: CHANGE_PAN,
    id: trackId,
    payload: {
      pan: pan,
    },
  };
};

export const changeName = (trackId: string, name: string) => {
  return {
    type: CHANGE_NAME,
    id: trackId,
    payload: {
      name: name,
    },
  };
};

export const loadTrackRequest = (trackId: string) => {
  return {
    type: LOAD_TRACK_REQUEST,
    id: trackId,
  };
};

export const loadTrackSuccess = (trackId: string) => {
  return {
    type: LOAD_TRACK_SUCCESS,
    id: trackId,
  };
};

export const changeActiveTake = (trackId: string, activeTakeId: string) => {
  return {
    type: CHANGE_ACTIVE_TAKE,
    id: trackId,
    payload: {
      activeTakeId: activeTakeId,
    },
  };
};

export const loadActiveTakeRequest = (trackId: string) => {
  return {
    type: LOAD_ACTIVE_TAKE_REQUEST,
    id: trackId,
  };
};

export const loadActiveTakeSuccess = (trackId: string) => {
  return {
    type: LOAD_ACTIVE_TAKE_SUCCESS,
    id: trackId,
  };
};

export const muteOn = (trackId: string) => {
  return {
    type: MUTE_ON,
    id: trackId,
  };
};

export const muteOff = (trackId: string) => {
  return {
    type: MUTE_OFF,
    id: trackId,
  };
};

export const soloOn = (trackId: string) => {
  return {
    type: SOLO_ON,
    id: trackId,
  };
};

export const soloOff = (trackId: string) => {
  return {
    type: SOLO_OFF,
    id: trackId,
  };
};

export type ActionUnionType =
  | ReturnType<typeof addTracks>
  | ReturnType<typeof changeVolume>
  | ReturnType<typeof changePan>
  | ReturnType<typeof changeName>
  | ReturnType<typeof loadTrackRequest>
  | ReturnType<typeof loadTrackSuccess>
  | ReturnType<typeof changeActiveTake>
  | ReturnType<typeof loadActiveTakeRequest>
  | ReturnType<typeof loadActiveTakeSuccess>
  | ReturnType<typeof muteOn>
  | ReturnType<typeof muteOff>
  | ReturnType<typeof soloOn>
  | ReturnType<typeof soloOff>
  | ReturnType<typeof uploadTakeFileSuccess>
  // From outer modules.
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof deleteTakeSuccess>;
