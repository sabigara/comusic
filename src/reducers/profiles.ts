import { combineReducers } from 'redux';

import { Profile } from '../common/Domain';
import { uniqueArray } from '../common/utils';
import { ActionTypeName, ActionUnionType } from '../actions';

export type ProfileState = Profile;

const initialState: ProfileState = {
  id: '',
  userId: '',
  createdAt: '',
  updatedAt: '',
  nickname: '',
  bio: '',
};

function profile(
  state: ProfileState = initialState,
  action: ActionUnionType,
): ProfileState {
  switch (action.type) {
    default:
      return state;
  }
}
type ByIdState = {
  [id: string]: ProfileState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.Profile.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        [action.payload.profile.id]: action.payload.profile,
      };
    case ActionTypeName.Profile.FETCH_STUDIO_MEMBERS:
      return {
        ...state,
        ...action.payload.profiles.byId,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Profile.FETCH_PROFILE_SUCCESS:
      return uniqueArray(state.concat(action.payload.profile.id));
    case ActionTypeName.Profile.FETCH_STUDIO_MEMBERS:
      return uniqueArray(state.concat(action.payload.profiles.allIds));
    default:
      return state;
  }
}

export type ProfileCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
