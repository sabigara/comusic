import { combineReducers } from 'redux';

import { ActionUnionType, ActionTypeName } from '../actions/files';

const initialState = {
  id: '',
  createdAt: '',
  updatedAt: '',
  url: '',
};

export type FileState = typeof initialState;

function file(state: FileState, action: ActionUnionType): FileState {
  switch (action.type) {
    case ActionTypeName.ADD_FILE:
      return {
        id: action.id,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
        url: action.payload.url,
      };
    default:
      return state;
  }
}

export type FileByIdState = {
  [id: string]: FileState;
};

function byId(
  state: FileByIdState = {},
  action: ActionUnionType,
): FileByIdState {
  switch (action.type) {
    case ActionTypeName.ADD_FILE:
    case ActionTypeName.RENAME_FILE:
      return {
        ...state,
        [action.id]: file(state[action.id], action),
      };
    case ActionTypeName.ADD_FILES:
      return {
        ...state,
        ...action.payload.byId,
      };
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.files.byId,
      };
    case ActionTypeName.ADD_TAKE_SUCCESS:
      return {
        ...state,
        [action.payload.file.id]: action.payload.file,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.ADD_FILE:
      return state.concat(action.id);
    case ActionTypeName.ADD_FILES:
      return state.concat(action.payload.allIds);
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.files.allIds);
    case ActionTypeName.ADD_TAKE_SUCCESS:
      return state.concat(action.payload.file.id);
    default:
      return state;
  }
}

export type FileCombinedState = {
  byId: FileByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
