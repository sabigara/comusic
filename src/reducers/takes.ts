import { combineReducers } from 'redux';

import { Take } from '../common/Domain';
import { ActionTypeName, ActionUnionType } from '../actions';

export type TakeState = Take;

const initialState: TakeState = {
  id: '',
  trackId: '',
  fileId: '',
  createdAt: '',
  updatedAt: '',
  name: '',
};

function take(
  state: TakeState = initialState,
  action: ActionUnionType,
): TakeState {
  switch (action.type) {
    default:
      return state;
  }
}

type TakeByIdState = {
  [id: string]: TakeState;
};

function byId(
  state: TakeByIdState = {},
  action: ActionUnionType,
): TakeByIdState {
  switch (action.type) {
    case ActionTypeName.Take.RENAME_TAKE:
      return {
        ...state,
        [action.id]: take(state[action.id], action),
      };
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.takes.byId,
      };
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
      return {
        ...state,
        [action.payload.take.id]: action.payload.take,
      };
    case ActionTypeName.Take.DEL_TAKE_SUCCESS:
      // Extract rest of the state except given take ID.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.id]: _, ...rest } = state;
      return {
        ...rest,
      };
    case ActionTypeName.Track.DEL_TRACK_SUCCESS:
      const filtered = Object.values(state).filter(
        (take) => take.trackId !== action.id,
      );
      return filtered.reduce((prev, take) => {
        return { ...prev, [take.id]: take };
      }, {});
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.takes.allIds);
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
      return state.concat(action.payload.take.id);
    case ActionTypeName.Take.DEL_TAKE_SUCCESS:
      return state.filter((id) => id !== action.id);
    case ActionTypeName.Track.DEL_TRACK_SUCCESS:
      return state.filter((id) => !action.payload.relatedTakeIds.includes(id));
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
