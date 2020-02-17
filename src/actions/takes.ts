import { Take, File } from '../common/Domain';

const RENAME_TAKE = 'RENAME_TAKE' as const;
const ADD_TAKE_REQUEST = 'ADD_TAKE_REQUEST' as const;
const ADD_TAKE_SUCCESS = 'ADD_TAKE_SUCCESS' as const;
const ADD_TAKE_FAILURE = 'ADD_TAKE_FAILURE' as const;
const DEL_TAKE_REQUEST = 'DEL_TAKE_REQUEST' as const;
const DEL_TAKE_SUCCESS = 'DEL_TAKE_SUCCESS' as const;
const DEL_TAKE_FAILURE = 'DEL_TAKE_FAILURE' as const;

export const TakeActionTypeName = {
  RENAME_TAKE,
  ADD_TAKE_REQUEST,
  ADD_TAKE_SUCCESS,
  ADD_TAKE_FAILURE,
  DEL_TAKE_REQUEST,
  DEL_TAKE_SUCCESS,
  DEL_TAKE_FAILURE,
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

export const addTakeSuccess = (id: string, take: Take, file: File) => {
  return {
    type: ADD_TAKE_SUCCESS,
    id: id,
    payload: {
      take: take,
      file: file,
    },
  };
};

export const delTakeSuccess = (id: string) => {
  return {
    type: DEL_TAKE_SUCCESS,
    id: id,
  };
};

export type TakeActionUnionType =
  | ReturnType<typeof renameTake>
  | ReturnType<typeof addTakeSuccess>
  | ReturnType<typeof delTakeSuccess>;
