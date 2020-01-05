import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { secondsToPixels } from '../common/conversions';
import useAudioAPI from '../hooks/useAudioAPI';

const Cursor: React.FC = () => {
  const state = useSelector((state: any) => state.playback.time);
  const audioAPI = useAudioAPI();
  const left = secondsToPixels(state, 1000, audioAPI.sampleRate);

  return (
    <Wrapper style={{left: left.toString() + 'px'}}></Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  background-color: black;
`

export default Cursor;
