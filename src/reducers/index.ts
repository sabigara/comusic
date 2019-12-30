import { combineReducers } from 'redux';

import playback from './playback';

const getReducers = () => {
  return combineReducers({
    playback,
  });
};

export default getReducers;