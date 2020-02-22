import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import getReducers from './reducers';

export function initStore(state: any) {
  return createStore(getReducers(), state);
}

export function renderWithRedux(elem: React.ReactElement, store: any) {
  return render(<Provider store={store}> {elem} </Provider>);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
