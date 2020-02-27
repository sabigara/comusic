import { combineReducers } from 'redux';

import { Song } from '../common/Domain';
import { uniqueArray } from '../common/utils';
import { ActionTypeName, ActionUnionType } from '../actions';

export type SongState = Song;

const initialState: SongState = {
  id: '',
  studioId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

function song(
  state: SongState = initialState,
  action: ActionUnionType,
): SongState {
  switch (action.type) {
    default:
      return state;
  }
}

type ByIdState = {
  [id: string]: SongState;
};

function byId(state: ByIdState = {}, action: ActionUnionType): ByIdState {
  switch (action.type) {
    case ActionTypeName.Studio.FETCH_STUDIO_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.songs.byId,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Studio.FETCH_STUDIO_CONTENTS_SUCCESS:
      return uniqueArray(state.concat(action.payload.songs.allIds));
    default:
      return state;
  }
}

export type SongCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
