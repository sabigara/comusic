import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import Color from '../common/Color';
import Waveform from './Waveform';

const hasStateChanged = (prev: any[], current: any[]) => {
  return prev.reduce(
    (isEqual: boolean, track: any, i: number) => {
      return isEqual || (
          track.id === current[i].id 
          && track.isTakeLoading === current[i].isTakeLoading
          && track.isTrackLoading === current[i].isTrackLoading
      )
    }, false
  );
}

const WaveformList: React.FC = () => {
  const state = useSelector((state: any) => {
    return state.trackList
  }, (prev, current) => {
    // Rerendering should happen only when track(s) is inserted or deleted,
    // or loading state has changed.
    if (prev.length !== current.length) { 
      return false 
    } else {
      return hasStateChanged(prev, current);
    }
  });

  return (
    <Wrapper>
      {
        state.map((track, i) => {
          return (
            <WaveformWrapper key={`waveform-${i}`}>
              {
                (track.isTrackLoading || track.isTakeLoading) 
                ? <div>loading...</div> 
                : <Waveform trackId={track.id}/>
              }
            </WaveformWrapper>
          )
        })
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  flex-grow: 1;
  background-color: ${Color.Waveform.Background};
  overflow-x: auto;
  &::-webkit-scrollbar {
    background-color: ${Color.Waveform.Background};
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
    height: 4px;
  }
`

const WaveformWrapper = styled.div`
  height: 170px;
`

export default WaveformList;
