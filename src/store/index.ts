import { createStore, compose, applyMiddleware } from 'redux';
import getReducers from '../reducers';

import logger from 'redux-logger'

export default (initialState?: Object) => {
  const store = createStore(
    getReducers(),
    initialState || {},
    applyMiddleware(logger)
  )
  return store;
};
