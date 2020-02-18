/* eslint-disable @typescript-eslint/camelcase */
import { Track } from '../common/Domain';

const ADD_TRACK_REQUEST = 'ADD_TRACK_REQUEST' as const;
const ADD_TRACK_SUCCESS = 'ADD_TRACK_SUCCESS' as const;
const ADD_TRACK_FAILURE = 'ADD_TRACK_FAILURE' as const;
const DEL_TRACK_REQUEST = 'DEL_TRACK_REQUEST' as const;
const DEL_TRACK_SUCCESS = 'DEL_TRACK_SUCCESS' as const;
const DEL_TRACK_FAILURE = 'DEL_TRACK_FAILURE' as const;
const UPDATE_TRACK_PARAM = 'UPDATE_TRACK_PARAM' as const;
const CHANGE_ACTIVE_TAKE = 'CHANGE_ACTIVE_TAKE' as const;
const LOAD_ACTIVE_TAKE_REQUEST = 'LOAD_ACTIVE_TAKE_REQUEST' as const;
const LOAD_ACTIVE_TAKE_SUCCESS = 'LOAD_ACTIVE_TAKE_SUCCESS' as const;
const LOAD_ACTIVE_TAKE_FAILURE = 'LOAD_ACTIVE_TAKE_FAILURE' as const;

export const TrackActionTypeName = {
  UPDATE_TRACK_PARAM,
  CHANGE_ACTIVE_TAKE,
  LOAD_ACTIVE_TAKE_REQUEST,
  LOAD_ACTIVE_TAKE_SUCCESS,
  LOAD_ACTIVE_TAKE_FAILURE,
  ADD_TRACK_REQUEST,
  ADD_TRACK_SUCCESS,
  ADD_TRACK_FAILURE,
  DEL_TRACK_REQUEST,
  DEL_TRACK_SUCCESS,
  DEL_TRACK_FAILURE,
};

export const updateTrackParam = (
  trackId: string,
  param: string,
  value: number,
) => {
  return {
    type: UPDATE_TRACK_PARAM,
    id: trackId,
    payload: {
      param: param,
      value: value,
    },
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

export const loadActiveTakeFailure = (trackId: string, err: string) => {
  return {
    type: LOAD_ACTIVE_TAKE_FAILURE,
    id: trackId,
    err: err,
  };
};

export const addTrackSuccess = (verId: string, track: Track) => {
  return {
    type: ADD_TRACK_SUCCESS,
    id: verId,
    payload: {
      track: track,
    },
  };
};

export const delTrackSuccess = (trackId: string) => {
  return {
    type: DEL_TRACK_SUCCESS,
    id: trackId,
  };
};

export type TrackActionUnionType =
  | ReturnType<typeof updateTrackParam>
  | ReturnType<typeof changeActiveTake>
  | ReturnType<typeof loadActiveTakeRequest>
  | ReturnType<typeof loadActiveTakeSuccess>
  | ReturnType<typeof loadActiveTakeFailure>
  | ReturnType<typeof addTrackSuccess>
  | ReturnType<typeof delTrackSuccess>;
