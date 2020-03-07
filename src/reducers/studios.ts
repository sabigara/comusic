import { combineReducers } from 'redux';

import { Studio } from '../common/Domain';
import { uniqueArray } from '../common/utils';
import { ActionTypeName, ActionUnionType } from '../actions';

export type StudioState = Studio;

const initialState: StudioState = {
  id: '',
  ownerId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

function studio(
  state: StudioState = initialState,
  action: ActionUnionType,
): StudioState {
  switch (action.type) {
    default:
      return state;
  }
}
type ByIdState = {
  [id: string]: StudioState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.Studio.FETCH_STUDIOS_SUCCESS:
      return {
        ...state,
        ...action.payload.byId,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Studio.FETCH_STUDIOS_SUCCESS:
      return uniqueArray(state.concat(action.payload.allIds));
    default:
      return state;
  }
}

export type StudioCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
