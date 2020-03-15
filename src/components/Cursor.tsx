import React, { useEffect } from 'react';
import styled from 'styled-components';

import { secondsToPixels } from '../common/conversions';
import useAudioAPI from '../hooks/useAudioAPI';

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

  return <Wrapper style={{ left: left.toString() + 'px' }}></Wrapper>;
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: white;
`;

export default Cursor;
