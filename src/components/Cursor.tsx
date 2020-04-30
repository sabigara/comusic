import React, { useEffect } from 'react';
import styled from 'styled-components';

import { secondsToPixels } from '../common/conversions';
import useAudioAPI from '../hooks/useAudioAPI';
import { ReactComponent as Knob } from '../knob.svg';

type Props = {
  offset?: number;
};

const Cursor: React.FC<Props> = ({ offset = 0 }) => {
  const audioAPI = useAudioAPI();
  const [time, setTime] = React.useState(0);

  useEffect(() => {
    audioAPI.onTimeUpdate((t) => {
      setTime(t);
    });
  }, []);
  const left = secondsToPixels(time, 1000, audioAPI.sampleRate) + offset;

  return (
    <>
      <Knob style={{ left: (left - 7).toString() + 'px', position: 'absolute', top: 0, width: 15, filter: 'drop-shadow(0px 0px 2px #000)' }}></Knob>
      <Line style={{ left: left.toString() + 'px' }}></Line>
    </>
  )
};

const Line = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: white;
`;

export default Cursor;
