import { combineReducers } from 'redux';

import { ActionUnionType, ActionTypeName } from '../actions/takes';

const initialState = {
  id: '',
  name: '',
  track: '',
  file: '',
};

export type TakeState = typeof initialState;

function take(state: TakeState, action: ActionUnionType): TakeState {
  switch (action.type) {
    default:
      return state;
  }
}

type ByIdState = {
  [id: string]: TakeState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.RENAME_TAKE:
      return {
        ...state,
        [action.id]: take(state[action.id], action),
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

export type TakeCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});