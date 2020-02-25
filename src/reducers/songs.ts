import { combineReducers } from 'redux';

import { Song } from '../common/Domain';
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

export type SongCombinedState = {
  byId: ByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
