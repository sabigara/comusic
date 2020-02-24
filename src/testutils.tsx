import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import getReducers from './reducers';

const logger = (store: any) => (next: any) => (action: any) => {
  console.log(action);
  console.log(store.getState());
  next(action);
  console.log(store.getState());
};

export function initStore(state: any, log = false) {
  const middleware = log ? [logger] : [];
  return createStore(getReducers(), state, applyMiddleware(...middleware));
}

export function renderWithRedux(elem: React.ReactElement, store: any) {
  return render(<Provider store={store}> {elem} </Provider>);
}

export function renderHookWithRedux<P, R>(
  callback: (props: P) => R,
  state: any,
) {
  const store = initStore(state);
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { ...renderHook<P, R>(callback, { wrapper }), store };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
