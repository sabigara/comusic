import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { secondsToPixels } from '../common/conversions';
import useAudioAPI from '../hooks/useAudioAPI';

type Props = {
  offset?: number
}

const Cursor: React.FC<Props> = ({ offset=0 }) => {
  const state = useSelector((state: any) => state.playback.time);
  const audioAPI = useAudioAPI();
  const left = secondsToPixels(state, 1000, audioAPI.sampleRate) + offset;

  return (
    <Wrapper style={{left: left.toString() + 'px'}}></Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: white;
`

export default Cursor;
