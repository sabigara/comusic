import { combineReducers } from 'redux';

import playback, {} from './playback';
import trackList from './trackList';


const getReducers = () => {
  const reducers = combineReducers({
    playback,
    trackList,
  });
  return reducers;
};

export default getReducers;