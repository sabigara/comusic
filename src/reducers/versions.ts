import { combineReducers } from 'redux';

import { Version } from '../common/Domain';
import { ActionTypeName, ActionUnionType } from '../actions';

export type VersionState = Version;

const initialState: VersionState = {
  id: '',
  songId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

function song(
  state: VersionState = initialState,
  action: ActionUnionType,
): VersionState {
  switch (action.type) {
    default:
      return state;
  }
}
type ByIdState = {
  [id: string]: VersionState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
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

export type VersionCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
