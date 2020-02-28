import { combineReducers } from 'redux';

import { Version } from '../common/Domain';
import { uniqueArray } from '../common/utils';
import { ActionTypeName, ActionUnionType } from '../actions';

export type VersionState = Version;

const initialState: VersionState = {
  id: '',
  songId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

function version(
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
    case ActionTypeName.Studio.FETCH_STUDIO_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.versions.byId,
      };
    case ActionTypeName.Version.ADD_VERSION_SUCCESS:
      return {
        ...state,
        [action.payload.version.id]: action.payload.version,
      };
    case ActionTypeName.Version.DEL_VERSION_SUCCESS:
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
    case ActionTypeName.Studio.FETCH_STUDIO_CONTENTS_SUCCESS:
      return uniqueArray(state.concat(action.payload.versions.allIds));
    case ActionTypeName.Version.ADD_VERSION_SUCCESS:
      return uniqueArray(state.concat(action.payload.version.id));
    case ActionTypeName.Version.DEL_VERSION_SUCCESS:
      return state.filter((id) => id !== action.id);
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
