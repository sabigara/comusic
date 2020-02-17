import { combineReducers } from 'redux';

import { Track, InstIcon } from '../common/Domain';
import { ActionUnionType, ActionTypeName } from '../actions';

// State of track is the same as domain model.
export type TrackState = Track;

const initialState: TrackState = {
  id: '',
  createdAt: '',
  updatedAt: '',
  versionId: '',
  activeTake: '',
  name: '',
  volume: 0,
  pan: 0,
  isMuted: false,
  isSoloed: false,
  icon: InstIcon.Drums,
};

function track(
  state: TrackState = initialState,
  action: ActionUnionType,
): TrackState {
  switch (action.type) {
    case ActionTypeName.Track.UPDATE_TRACK_PARAM:
      return { ...state, [action.payload.param]: action.payload.value };
    case ActionTypeName.Track.CHANGE_ACTIVE_TAKE:
      return { ...state, activeTake: action.payload.activeTakeId };
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
      return { ...state, activeTake: action.payload.take.id };
    case ActionTypeName.Take.DEL_TAKE_SUCCESS:
      return { ...state, activeTake: '' };
    default:
      return state;
  }
}

type TrackByIdState = {
  [id: string]: TrackState;
};

function filterByActiveTake(state: TrackByIdState, activeTakeId: string) {
  return Object.values(state).filter((tr) => tr.activeTake === activeTakeId);
}

function byId(
  state: TrackByIdState = {},
  action: ActionUnionType,
): TrackByIdState {
  switch (action.type) {
    case ActionTypeName.Track.UPDATE_TRACK_PARAM:
    case ActionTypeName.Track.CHANGE_ACTIVE_TAKE:
    case ActionTypeName.Take.ADD_TAKE_SUCCESS:
      return {
        ...state,
        [action.id]: track(state[action.id], action),
      };
    case ActionTypeName.Take.DEL_TAKE_SUCCESS:
      // Zeroize activeTake attribute of all tracks that have deleted activeTake ID.
      const tracks = filterByActiveTake(state, action.id).reduce((prev, tr) => {
        return {
          ...prev,
          [tr.id]: track(tr, action),
        };
      }, {});
      return {
        ...state,
        ...tracks,
      };
    case ActionTypeName.Track.ADD_TRACK_SUCCESS:
      return {
        ...state,
        [action.payload.track.id]: action.payload.track,
      };
    case ActionTypeName.Track.DEL_TRACK_SUCCESS:
      // Extract rest of the state except given take ID.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.id]: _, ...rest } = state;
      return {
        ...rest,
      };
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.tracks.byId,
      };
    default:
      return state;
  }
}

function allIds(state: string[] = [], action: ActionUnionType): string[] {
  switch (action.type) {
    case ActionTypeName.Track.ADD_TRACK_SUCCESS:
      return state.concat(action.payload.track.id);
    case ActionTypeName.Track.DEL_TRACK_SUCCESS:
      return state.filter((id) => id !== action.id);
    case ActionTypeName.Version.FETCH_VER_CONTENTS_SUCCESS:
      return state.concat(action.payload.tracks.allIds);
    default:
      return state;
  }
}

export type TrackCombinedState = {
  byId: TrackByIdState;
  allIds: string[];
};

export default combineReducers({
  byId,
  allIds,
});
