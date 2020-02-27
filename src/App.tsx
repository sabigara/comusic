import React, { createContext, useState } from 'react';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import styled from 'styled-components';

import WebAudioAPI from './AudioAPI/WebAudioAPI';
import BackendAPI from './BackendAPI/Default';
import initStore from './store';
import KeyBindings from './components/KeyBindings';
import ToolBar from './components/ToolBar';
import Browser from './components/Browser';
import Editor from './components/Editor';
const store = initStore();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

// Inject dependencies (Delivered by hooks API).
export const webAudioAPICtx = createContext(new WebAudioAPI());
export const backendAPICtx = createContext(new BackendAPI());

const App: React.FC = () => {
  const [openingVer, setOpeningVer] = useState<string>('');
  return (
    <Provider store={store}>
      <KeyBindings />
      <ToolBar />
      <FixedHeightContainer>
        <Browser setVerId={setOpeningVer} />
        <Editor verId={openingVer} />
      </FixedHeightContainer>
    </Provider>
  );
};

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  display: flex;
`;

export default App;
