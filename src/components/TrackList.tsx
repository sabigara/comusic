import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useAudioAPI from '../hooks/useAudioAPI';
import usePrevious from '../hooks/usePrevious';
import styled from 'styled-components';
import Color from '../common/Color';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';


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

  const [ isLoading, setLoading ] = useState(true);

  const audioAPI = useAudioAPI();
  const activeTakeFileURLs = state.map((track) => {
    return {
      fileURL: track.takeList.filter((take) => take.id === track.activeTakeId)[0].fileURL,
      name: track.name,
      id: track.id,
    }
  });

  const prev = usePrevious(state, []);

  useEffect(() => {
    async function _() {
      await audioAPI.loadTrackList(activeTakeFileURLs);
      setLoading(false);
    }
    if (!hasStateChanged(prev, state)) {
      _();
    }
  }, [audioAPI, activeTakeFileURLs, prev, state]);

  if (isLoading) { return <div></div> }

  return (
    <Wrapper>
      {
        state.map((track, i) => {
          return (
            <div key={`track-${i}`}>
              <TrackWrapper>
                <TrackPanel trackId={track.id}/>
                <SeparatorV/>
                <TakeList
                  trackId={track.id}
                  takeList={track.takeList}
                  activeTakeId={track.activeTakeId}
                />
                <Spacer/>
                <SeparatorV/>
              </TrackWrapper>
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

const TrackWrapper = styled.div`
  display: flex;
`

const SeparatorV = styled.div`
  width: 2px;
  background-color: #777;
`

const SeparatorH = styled.div`
  height: 2px;
  background-color: #777;
`

const Spacer = styled.div`
  width: 5px;
`

export default TrackList;
