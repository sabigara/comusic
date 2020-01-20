import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import { WebAudioAPI }  from './AudioAPI';
import initStore from './store';
import ToolBar from './components/ToolBar';
import TrackList from './components/TrackList';
import WaveformList from './components/WaveformList';
import mockState from './mockState';

const store = initStore(mockState);

export const webAudioAPI = createContext(new WebAudioAPI());

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToolBar/>
      <FixedHeightContainer>
          <TrackList/>
          <WaveformList/>
      </FixedHeightContainer>
    </Provider>
  );
}

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  overflow-y: scroll;
  display: flex;
`

export default App;
