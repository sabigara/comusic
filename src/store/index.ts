import { createStore, applyMiddleware, Store } from 'redux';
import getReducers from '../reducers';

import thunk from 'redux-thunk';

export default (initialState?: Record<string, any>): Store => {
  const store = createStore(
    getReducers(),
    initialState || {},
    applyMiddleware(thunk),
  );
  return store;
};
