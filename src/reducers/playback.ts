import { Actions } from '../actions/playback';

const initialState = 'Stopping'

export default function playback(
  state: typeof initialState = initialState,
  action: Actions
) {
  switch (action.type) {
    case 'PLAY':
      return 'Playing';
    case 'PAUSE':
      return 'Pausing';
    case 'STOP':
      return 'Stopping';
    default:
      return state;
  }
}
