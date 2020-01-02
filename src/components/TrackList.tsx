import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import Color from '../common/Color';
import Track from './Track';


const hasStateChanged = (prev: any[], current: any[]) => {
return prev.reduce(
  (isEqual: boolean, track: any, i: number) => {
    return isEqual || track.id === current[i].id
  }, false
)
}

const TrackList: React.FC = () => {
  const state = useSelector((state: any) => {
    return state.trackList
  }, (prev, current) => {
    // Rerendering should happen only when track(s) is inserted or deleted.
    // (Not when volume of a track changed, for example.)
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
            <div key={`track-${i}`}>
              <Track trackId={track.id}/>
              <SeparatorH/>
            </div>
          )
        })
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${Color.Background};
`

const SeparatorH = styled.div`
  height: 2px;
  background-color: #777;
`

const Spacer = styled.div`
  width: 5px;
`

export default TrackList;
