import { TakeState } from '../reducers/takes';
import { FileState } from '../reducers/files';
import {
  fetchVerContentsSuccess,
  FETCH_VER_CONTENTS_SUCCESS,
} from './versions';

const ADD_TAKE = 'ADD_TAKE' as const;
const ADD_TAKES = 'ADD_TAKES' as const;
const RENAME_TAKE = 'RENAME_TAKE' as const;
const UPLOAD_TAKE_FILE_REQUEST = 'UPLOAD_TAKE_FILE_REQUEST' as const;
export const UPLOAD_TAKE_FILE_SUCCESS = 'UPLOAD_TAKE_FILE_SUCCESS' as const;
const UPLOAD_TAKE_FILE_FAILURE = 'UPLOAD_TAKE_FILE_FAILURE' as const;

export const ActionTypeName = {
  ADD_TAKE,
  ADD_TAKES,
  RENAME_TAKE,
  UPLOAD_TAKE_FILE_REQUEST,
  UPLOAD_TAKE_FILE_SUCCESS,
  UPLOAD_TAKE_FILE_FAILURE,
  // From outer modules.
  FETCH_VER_CONTENTS_SUCCESS,
};

export const addTake = (
  takeId: string,
  trackId: string,
  fileId: string,
  createdAt: string,
  updatedAt: string,
  name: string,
) => {
  return {
    type: ADD_TAKE,
    id: takeId,
    payload: {
      trackId: trackId,
      fileId: fileId,
      createdAt: createdAt,
      updatedAt: updatedAt,
      name: name,
    },
  };
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

export const uploadTakeFileRequest = (id: string) => {
  return {
    type: UPLOAD_TAKE_FILE_REQUEST,
    id: id,
  };
};

export const uploadTakeFileSuccess = (
  id: string,
  take: TakeState,
  file: FileState,
) => {
  return {
    type: UPLOAD_TAKE_FILE_SUCCESS,
    id: id,
    payload: {
      take: take,
      file: file,
    },
  };
};

export const uploadTakeFileFailure = (id: string) => {
  return {
    type: UPLOAD_TAKE_FILE_FAILURE,
    id: id,
  };
};

export const uploadTakeFile = (trackId: string, formData: FormData) => {
  return async (dispatch: any) => {
    dispatch(uploadTakeFileRequest(trackId));
    try {
      const resp = await fetch(
        'http://localhost:1323/takes?track_id=' + trackId,
        {
          method: 'POST',
          body: formData,
        },
      );
      const json = await resp.json();
      dispatch(uploadTakeFileSuccess(trackId, json.take, json.file));
    } catch {
      dispatch(uploadTakeFileFailure(trackId));
    }
  };
};

export type ActionUnionType =
  | ReturnType<typeof addTake>
  | ReturnType<typeof renameTake>
  | ReturnType<typeof uploadTakeFileSuccess>
  // From outer modules.
  | ReturnType<typeof fetchVerContentsSuccess>;
