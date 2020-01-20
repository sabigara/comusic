import { combineReducers } from 'redux';

import loading from './loading';
import playback, {} from './playback';
import tracks from './tracks';
import takes from './takes';
import files from './files';


const getReducers = () => {
  const reducers = combineReducers({
    loading,
    playback,
    tracks,
    takes,
    files,
  });
  return reducers;
};

export default getReducers;
