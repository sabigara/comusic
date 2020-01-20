import { combineReducers } from 'redux';

type Take = {
  id: string,
  name: string,
  track: string,
  file: string,
}

const initialState = {}

function take(state: Take, action) {
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
        [action.id]: take(state[action.id], action),
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
    case 'ADD_TAKE':
      return [ ...state, action.id ]
    default:
      return state;
    };
}

export default combineReducers({
  byId,
  allIds,
});
