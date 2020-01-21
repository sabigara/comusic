import { combineReducers } from 'redux';

import { ActionUnionType, ActionTypeName } from '../actions/files';

const initialState = {
  id: '',
  name: '',
  uri: '',
};

export type FileState = typeof initialState;

function file(state: FileState, action: ActionUnionType): FileState {
  switch (action.type) {
    case ActionTypeName.RENAME_FILE:
      return { ...state, name: action.payload.name };
    default:
      return state;
  }
}

type ByIdState = {
  [id: string]: FileState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.RENAME_FILE:
      return {
        ...state,
        [action.id]: file(state[action.id], action),
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    default:
      return state;
  }
}

export type FileCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
