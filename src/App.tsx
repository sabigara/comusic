import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import { WebAudioAPI }  from './AudioAPI';
import { InstIcon } from './common/Enums';
import initStore from './store';
import ToolBar from './components/ToolBar';
import TrackList from './components/TrackList';
import WaveformList from './components/WaveformList';

const store = initStore({
  playback: {
    status: 2,
    time: 0,
  },
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
          id: '0_0',
          name: 'take0',
          fileURL: 'sounds/Drums.wav',
        },
        {
          id: '0_1',
          name: 'take1',
          fileURL: 'sounds/Rhodes.wav'
        },
        {
          id: '0_2',
          name: 'take2',
        },
        {
          id: '0_3',
          name: 'take3',
        },
        {
          id: '0_4',
          name: 'take4',
        },
        {
          id: '0_5',
          name: 'take5',
        },
      ],
      activeTakeId: '0_1',
      isTrackLoading: true,
      isTakeLoading: true,
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
          id: '1_0',
          name: 'take0',
          fileURL: 'sounds/Bass.wav'
        }
      ],
      activeTakeId: '1_0',
      isTrackLoading: true,
      isTakeLoading: true,
    },
    {
      id: '2',
      name: 'Rhodes',
      volume: 0.9,
      pan: 0,
      mute: true,
      solo: false,
      icon: InstIcon.Drums,
      takeList: [
        {
          id: '2_0',
          name: 'take0',
          fileURL: 'sounds/Rhodes.wav'
        }
      ],
      activeTakeId: '2_0',
      isTrackLoading: true,
      isTakeLoading: true,
    },
    // {
    //   id: '3',
    //   name: 'Vocal',
    //   volume: 0.5,
    //   pan: 0,
    //   mute: false,
    //   solo: false,
    //   icon: InstIcon.Drums,
    //   takeList: [
    //     {
    //       id: '0',
    //       name: 'take0',
    //       fileURL: 'sounds/LeadVocal.wav'
    //     }
    //   ],
    //   activeTakeId: '0',
    //   isTrackLoading: true,
    //   isTakeLoading: true,
    // },
    // {
    //   id: '4',
    //   name: 'Drums',
    //   volume: 0.4,
    //   pan: 0,
    //   mute: false,
    //   solo: false,
    //   icon: InstIcon.Drums,
    //   takeList: [
    //     {
    //       id: '0',
    //       name: 'take0',
    //       fileURL: 'sounds/Drums.wav'
    //     },
    //     {
    //       id: '1',
    //       name: 'take1',
    //       fileURL: 'sounds/Rhodes.wav'
    //     },
    //     {
    //       id: '2',
    //       name: 'take2',
    //     },
    //     {
    //       id: '3',
    //       name: 'take3',
    //     },
    //     {
    //       id: '4',
    //       name: 'take4',
    //     },
    //     {
    //       id: '5',
    //       name: 'take5',
    //     },
    //   ],
    //   activeTakeId: '0',
    //   isTrackLoading: true,
    //   isTakeLoading: true,
    // },
    // {
    //   id: '5',
    //   name: 'Bass',
    //   volume: 0.9,
    //   pan: 0,
    //   mute: false,
    //   solo: false,
    //   icon: InstIcon.Drums,
    //   takeList: [
    //     {
    //       id: '0',
    //       name: 'take0',
    //       fileURL: 'sounds/Bass.wav'
    //     }
    //   ],
    //   activeTakeId: '0',
    //   isTrackLoading: true,
    //   isTakeLoading: true,
    // },
    // {
    //   id: '6',
    //   name: 'Rhodes',
    //   volume: 0.9,
    //   pan: 0,
    //   mute: false,
    //   solo: false,
    //   icon: InstIcon.Drums,
    //   takeList: [
    //     {
    //       id: '0',
    //       name: 'take0',
    //       fileURL: 'sounds/Rhodes.wav'
    //     }
    //   ],
    //   activeTakeId: '0',
    //   isTrackLoading: true,
    //   isTakeLoading: true,
    // },
    // {
    //   id: '7',
    //   name: 'Vocal',
    //   volume: 0.5,
    //   pan: 0,
    //   mute: false,
    //   solo: false,
    //   icon: InstIcon.Drums,
    //   takeList: [
    //     {
    //       id: '0',
    //       name: 'take0',
    //       fileURL: 'sounds/LeadVocal.wav'
    //     }
    //   ],
    //   activeTakeId: '0',
    //   isTrackLoading: true,
    //   isTakeLoading: true,
    // }
  ],
  waveformConfig: {
    resolution: 1000,
  }
})

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
