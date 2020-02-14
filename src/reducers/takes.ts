import { combineReducers } from 'redux';

import { ActionUnionType, ActionTypeName } from '../actions/takes';

const initialState = {
  id: '',
  trackId: '',
  fileId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

export type TakeState = typeof initialState;

function take(state: TakeState, action: ActionUnionType): TakeState {
  switch (action.type) {
    case ActionTypeName.ADD_TAKE:
      return {
        id: action.id,
        trackId: action.payload.trackId,
        fileId: action.payload.fileId,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
        name: 'new take',
      };
    default:
      return state;
  }
}

export type TakeByIdState = {
  [id: string]: TakeState;
};

function byId(
  state: TakeByIdState = {},
  action: ActionUnionType,
): TakeByIdState {
  switch (action.type) {
    case ActionTypeName.RENAME_TAKE:
      return {
        ...state,
        [action.id]: take(state[action.id], action),
      };
    case ActionTypeName.ADD_TAKE:
      return {
        ...state,
        [action.id]: take(state[action.id], action),
      };
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.takes.byId,
      };
    case ActionTypeName.UPLOAD_TAKE_FILE_SUCCESS:
      return {
        ...state,
        [action.payload.take.id]: action.payload.take,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.ADD_TAKE:
      return state.concat(action.id);
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.takes.allIds);
    case ActionTypeName.UPLOAD_TAKE_FILE_SUCCESS:
      return state.concat(action.payload.take.id);
    default:
      return state;
  }
}

export type TakeCombinedState = {
  byId: TakeByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
