import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import { WebAudioAPI }  from './AudioAPI';

import { InstIcon } from './common/Enums';
import initStore from './store';
import ToolBar from './components/ToolBar';
import TrackList from './components/TrackList';

const store = initStore({
  playback: 2,
  trackList: [
    {
      id: '0',
      name: 'Drums',
      volume: 0.4,
      pan: 0,
      mute: false,
      solo: false,
      icon: InstIcon.Drums,
      takeList: [
        {
          id: '0',
          name: 'take0',
          fileURL: 'sounds/Drums.wav'
        },
        {
          id: '1',
          name: 'take1',
          fileURL: 'sounds/Rhodes.wav'
        },
        {
          id: '2',
          name: 'take2',
        },
        {
          id: '3',
          name: 'take3',
        },
        {
          id: '4',
          name: 'take4',
        },
        {
          id: '5',
          name: 'take5',
        },
      ],
      activeTakeId: '0',
    },
    {
      id: '1',
      name: 'Bass',
      volume: 0.9,
      pan: 0,
      mute: false,
      solo: false,
      icon: InstIcon.Drums,
      takeList: [
        {
          id: '0',
          name: 'take0',
          fileURL: 'sounds/Bass.wav'
        }
      ],
      activeTakeId: '0',
    },
    {
      id: '2',
      name: 'Rhodes',
      volume: 0.9,
      pan: 0,
      mute: false,
      solo: false,
      icon: InstIcon.Drums,
      takeList: [
        {
          id: '0',
          name: 'take0',
          fileURL: 'sounds/Rhodes.wav'
        }
      ],
      activeTakeId: '0',
    }
  ]
})

export const webAudioAPI = createContext(new WebAudioAPI());

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToolBar/>
      <TrackList/>
    </Provider>
  );
}

export default App;
