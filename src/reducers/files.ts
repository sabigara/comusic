import { combineReducers } from 'redux';

type File = {
  id: string,
  uri: string,
}

const initialState = {}

function file(state: File, action) {
  switch (action.type) {
    default:
      return state;
  }}

function byId(
  state: typeof initialState = initialState,
  action: any
) {
  switch (action.type) {
    case '':
      return {
        ...state,
        [action.id]: file(state[action.id], action),
      };
    default:
      return state;
  }
}

function allIds(
  state: string[] = [],
  action: any
) {
  switch (action.type) {
    case 'ADD_FILE':
      return [ ...state, action.id ]
    default:
      return state;
    };
}

export default combineReducers({
  byId,
  allIds,
});
