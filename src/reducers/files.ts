import { combineReducers } from 'redux';

import { File } from '../common/Domain';
import { ActionUnionType, ActionTypeName } from '../actions';

export type FileState = File;

const initialState: FileState = {
  id: '',
  createdAt: '',
  updatedAt: '',
  url: '',
};

function file(
  state: FileState = initialState,
  action: ActionUnionType,
): FileState {
  switch (action.type) {
    default:
      return state;
  }
}

type FileByIdState = {
  [id: string]: FileState;
};

function byId(
  state: FileByIdState = {},
  action: ActionUnionType,
): FileByIdState {
  switch (action.type) {
    case ActionTypeName.File.ADD_FILE:
    case ActionTypeName.File.RENAME_FILE:
      return {
        ...state,
        [action.id]: file(state[action.id], action),
      };
    case ActionTypeName.File.ADD_FILES:
      return {
        ...state,
        ...action.payload.byId,
      };
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.files.byId,
      };
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
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
    case ActionTypeName.File.ADD_FILE:
      return state.concat(action.id);
    case ActionTypeName.File.ADD_FILES:
      return state.concat(action.payload.allIds);
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.files.allIds);
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
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
