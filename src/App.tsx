import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import WebAudioAPI from './AudioAPI/WebAudioAPI';
import BackendAPI from './BackendAPI/Default';
import initStore from './store';
import KeyBindings from './components/KeyBindings';
import ToolBar from './components/ToolBar';
import Editor from './components/Editor';

const store = initStore();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

// Inject dependencies (Delivered by hooks API).
export const webAudioAPICtx = createContext(new WebAudioAPI());
export const backendAPICtx = createContext(new BackendAPI());

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <KeyBindings />
      <ToolBar />
      <Editor />
    </Provider>
  );
};

export default App;
