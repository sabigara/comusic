import { File } from '../common/Domain';

const ADD_FILE = 'ADD_FILE' as const;
const ADD_FILES = 'ADD_FILES' as const;
const RENAME_FILE = 'RENAME_FILE' as const;

export const FileActionTypeName = {
  ADD_FILE,
  ADD_FILES,
  RENAME_FILE,
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

export const addFiles = (byId: { [id: string]: File }, allIds: string[]) => {
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

export type FileActionUnionType =
  | ReturnType<typeof addFile>
  | ReturnType<typeof addFiles>
  | ReturnType<typeof renameFile>;
