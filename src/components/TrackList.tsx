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
  );
}

const TrackList: React.FC = () => {
  const state = useSelector((state: any) => {
    return state.tracks.allIds.map((id: string) => state.tracks.byId[id]);
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
              <SeparatorH/>
              <TrackWrapper >
                <Track trackId={track.id}/>
              </TrackWrapper>
              { i === state.length - 1  ? <SeparatorH/> : null }
            </div>
          )
        })
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${Color.Track.Background};
  padding-top: 20px;
`

const TrackWrapper = styled.div`
  height: 169px;
`

const SeparatorH = styled.div`
  height: 1px;
  background-color: #777;
`

export default TrackList;
