import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import useAudioAPI from '../hooks/useAudioAPI';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';

type Props = {
  trackId: string,
}

const Track: React.FC<Props> = ({ trackId }) => {
  const state = useSelector((state: any) => {
    const track = state.trackList.filter((track: any) => track.id === trackId);
    return track ? track[0] : null
  }, (prev, current) => {
    return prev.id === current.id
  }
  );

  const audioAPI = useAudioAPI();
  const [ isLoading, setLoading ] = useState(true);

  useEffect(() => {
      audioAPI.loadTrack({
            name: state.name,
            id: state.id,
      });
      setLoading(false);
  }, [audioAPI, state.name, state.id]);

  if (isLoading) { return <div></div> }

  return(
    <TrackWrapper>
      <TrackPanel trackId={trackId}/>
      <SeparatorV/>
      <TakeList
        trackId={trackId}
      />
      <Spacer/>
      <SeparatorV/>
    </TrackWrapper>

  )
}

const TrackWrapper = styled.div`
  display: flex;
`

const SeparatorV = styled.div`
  width: 2px;
  background-color: #777;
`

const Spacer = styled.div`
  width: 5px;
`

export default Track;