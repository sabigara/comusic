/* eslint-disable @typescript-eslint/camelcase */
import { createAction } from './index';
import { TrackState } from '../reducers/tracks';
import {
  addTakeSuccess,
  ADD_TAKE_SUCCESS,
  deleteTakeSuccess,
  DELETE_TAKE_SUCCESS,
} from './takes';
import {
  fetchVerContentsSuccess,
  FETCH_VER_CONTENTS_SUCCESS,
} from './versions';
import { backendAPI } from '.';

const ADD_TRACK_REQUEST = 'ADD_TRACK_REQUEST' as const;
const ADD_TRACK_SUCCESS = 'ADD_TRACK_SUCCESS' as const;
const ADD_TRACK_FAILURE = 'ADD_TRACK_FAILURE' as const;
const DELETE_TRACK_REQUEST = 'DELETE_TRACK_REQUEST' as const;
const DELETE_TRACK_SUCCESS = 'DELETE_TRACK_SUCCESS' as const;
const DELETE_TRACK_FAILURE = 'DELETE_TRACK_FAILURE' as const;
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
  ADD_TRACK_SUCCESS,
  DELETE_TRACK_SUCCESS,
  ADD_TAKE_SUCCESS,
  // From outer modules.
  FETCH_VER_CONTENTS_SUCCESS,
  DELETE_TAKE_SUCCESS,
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

const addTrackSuccess = (verId: string, track: TrackState) => {
  return {
    type: ADD_TRACK_SUCCESS,
    id: verId,
    payload: {
      track: track,
    },
  };
};

export const addTrack = (verId: string) => {
  return async (dispatch: any) => {
    dispatch(createAction(ADD_TRACK_REQUEST, verId));
    try {
      const resp = await backendAPI.addTrack(verId);
      dispatch(addTrackSuccess(verId, resp));
    } catch (err) {
      dispatch(createAction(ADD_TRACK_FAILURE, verId));
    }
  };
};

const deleteTrackSuccess = (trackId: string) => {
  return {
    type: DELETE_TRACK_SUCCESS,
    id: trackId,
  };
};

export const deleteTrack = (trackId: string) => {
  return async (dispatch: any) => {
    dispatch(createAction(DELETE_TRACK_REQUEST, trackId));
    try {
      await backendAPI.delTrack(trackId);
      dispatch(deleteTrackSuccess(trackId));
    } catch (err) {
      dispatch(createAction(DELETE_TRACK_FAILURE, trackId));
    }
  };
};

export type ActionUnionType =
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
  | ReturnType<typeof addTrackSuccess>
  | ReturnType<typeof deleteTrackSuccess>
  // From outer modules.
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof addTakeSuccess>
  | ReturnType<typeof deleteTakeSuccess>;
