import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';

import WebAudioAPI from './AudioAPI/WebAudioAPI';
import BackendAPI from './BackendAPI/Default';
import initStore from './store';
import KeyBindings from './components/KeyBindings';
import ToolBar from './components/ToolBar';
import TrackList from './components/TrackList';
import WaveformList from './components/WaveformList';

const store = initStore();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

// Inject dependencies.
export const webAudioAPICtx = createContext(new WebAudioAPI());
export const backendAPICtx = createContext(new BackendAPI());

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <KeyBindings />
      <ToolBar />
      <FixedHeightContainer>
        <TrackList />
        <WaveformList />
      </FixedHeightContainer>
    </Provider>
  );
};

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  overflow-y: scroll;
  display: flex;
`;

export default App;
