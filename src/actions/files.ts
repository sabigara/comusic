import { FileByIdState } from '../reducers/files';
import {
  fetchVerContentsSuccess,
  FETCH_VER_CONTENTS_SUCCESS,
} from './versions';
import { addTakeSuccess, ADD_TAKE_SUCCESS } from './takes';

const ADD_FILE = 'ADD_FILE' as const;
const ADD_FILES = 'ADD_FILES' as const;
const RENAME_FILE = 'RENAME_FILE' as const;

export const ActionTypeName = {
  ADD_FILE,
  ADD_FILES,
  RENAME_FILE,
  // From outer modules.
  FETCH_VER_CONTENTS_SUCCESS,
  ADD_TAKE_SUCCESS,
};

export const addFile = (
  id: string,
  createdAt: string,
  updatedAt: string,
  url: string,
) => {
  return {
    type: ADD_FILE,
    id: id,
    payload: {
      createdAt: createdAt,
      updatedAt: updatedAt,
      url: url,
    },
  };
};

export const addFiles = (byId: FileByIdState, allIds: string[]) => {
  return {
    type: ADD_FILES,
    payload: {
      byId: byId,
      allIds: allIds,
    },
  };
};

export const renameFile = (id: string, name: string) => {
  return {
    type: RENAME_FILE,
    id: id,
    payload: {
      name: name,
    },
  };
};

export type ActionUnionType =
  | ReturnType<typeof addFile>
  | ReturnType<typeof addFiles>
  | ReturnType<typeof renameFile>
  // From outer modules.
  | ReturnType<typeof fetchVerContentsSuccess>
  | ReturnType<typeof addTakeSuccess>;
