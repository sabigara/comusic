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
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.takes.byId,
      };
    case ActionTypeName.ADD_TAKE_SUCCESS:
      return {
        ...state,
        [action.payload.take.id]: action.payload.take,
      };
    case ActionTypeName.DELETE_TAKE_SUCCESS:
      // Extract rest of the state except given take ID.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.id]: _, ...rest } = state;
      return {
        ...rest,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.takes.allIds);
    case ActionTypeName.ADD_TAKE_SUCCESS:
      return state.concat(action.payload.take.id);
    case ActionTypeName.DELETE_TAKE_SUCCESS:
      return state.filter((id) => id !== action.id);
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
