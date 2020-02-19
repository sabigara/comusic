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
  const refTrk = React.useRef<HTMLDivElement>(null);
  const refWav = React.useRef<HTMLDivElement>(null);
  const onScrollTrk = (e: any) => {
    if (e.scrollLeft) {
      refWav.current?.scrollTo(e.scrollLeft, refWav.current?.scrollTop);
    } else {
      refWav.current?.scrollTo(refWav.current?.scrollLeft, e.scrollTop);
    }
  };
  const onScrollWav = (e: any) => {
    refTrk.current?.scrollTo(0, e.scrollTop);
  };
  return (
    <Provider store={store}>
      <KeyBindings />
      <ToolBar />
      <FixedHeightContainer>
        <TrackList ref={refTrk} onScroll={onScrollTrk} />
        <WaveformList ref={refWav} onScroll={onScrollWav} />
      </FixedHeightContainer>
    </Provider>
  );
};

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
`;

export default App;
