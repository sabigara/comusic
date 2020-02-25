import { createStore, applyMiddleware, Store } from 'redux';
import getReducers from '../reducers';
import * as Sentry from '@sentry/browser';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

const errReporter = (store: any) => (next: any) => (action: any) => {
  const matches = /(.*)_FAILURE/.exec(action.type);
  if (!matches) return next(action);

  Sentry.captureException(action.err);
  return next(action);
};

export default (initialState?: any) => {
  return createStore(
    getReducers(),
    initialState || {},
    applyMiddleware(thunk, errReporter, logger),
  );
};
