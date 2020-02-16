import { TakeState } from '../reducers/takes';
import { FileState } from '../reducers/files';
import { createAction, backendAPI } from '.';
import {
  fetchVerContentsSuccess,
  FETCH_VER_CONTENTS_SUCCESS,
} from './versions';

const RENAME_TAKE = 'RENAME_TAKE' as const;
const ADD_TAKE_REQUEST = 'ADD_TAKE_REQUEST' as const;
export const ADD_TAKE_SUCCESS = 'ADD_TAKE_SUCCESS' as const;
const ADD_TAKE_FAILURE = 'ADD_TAKE_FAILURE' as const;
const DELETE_TAKE_REQUEST = 'DELETE_TAKE_REQUEST' as const;
export const DELETE_TAKE_SUCCESS = 'DELETE_TAKE_SUCCESS' as const;
const DELETE_TAKE_FAILURE = 'DELETE_TAKE_FAILURE' as const;

export const ActionTypeName = {
  RENAME_TAKE,
  ADD_TAKE_SUCCESS,
  DELETE_TAKE_SUCCESS,
  // From outer modules.
  FETCH_VER_CONTENTS_SUCCESS,
};

export const renameTake = (id: string, name: string) => {
  return {
    type: RENAME_TAKE,
    id: id,
    payload: {
      name: name,
    },
  };
};

export const addTakeSuccess = (
  id: string,
  take: TakeState,
  file: FileState,
) => {
  return {
    type: ADD_TAKE_SUCCESS,
    id: id,
    payload: {
      take: take,
      file: file,
    },
  };
};

export const addTake = (trackId: string, formData: FormData) => {
  return async (dispatch: any) => {
    dispatch(createAction(ADD_TAKE_REQUEST, trackId));
    try {
      const resp = await backendAPI.addTake(trackId, formData);
      dispatch(addTakeSuccess(trackId, resp.take, resp.file));
    } catch (err) {
      dispatch(createAction(ADD_TAKE_FAILURE, trackId));
    }
  };
};

export const deleteTakeSuccess = (id: string) => {
  return {
    type: DELETE_TAKE_SUCCESS,
    id: id,
  };
};

export const deleteTake = (takeId: string) => {
  return async (dispatch: any) => {
    dispatch(createAction(DELETE_TAKE_REQUEST, takeId));
    try {
      await backendAPI.delTake(takeId);
      dispatch(deleteTakeSuccess(takeId));
    } catch (err) {
      dispatch(createAction(DELETE_TAKE_FAILURE, takeId));
    }
  };
};

export type ActionUnionType =
  | ReturnType<typeof renameTake>
  | ReturnType<typeof addTakeSuccess>
  | ReturnType<typeof deleteTakeSuccess>
  // From outer modules.
  | ReturnType<typeof fetchVerContentsSuccess>;
