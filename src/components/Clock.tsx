import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../reducers';
import Label from '../atoms/Label';

function formatTime(timeInSeconds: number) {
  let miliSecs = timeInSeconds % 1;
  timeInSeconds -= miliSecs;
  miliSecs = Math.round(miliSecs * 100) / 100;
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return { minutes, seconds, miliSecs };
}

function padStr(numStr: string, pad: string, length: number, right = false) {
  if (right) {
    return (numStr + new Array(length + 1).join(pad)).slice(0, length);
  } else {
    return (new Array(length + 1).join(pad) + numStr).slice(-length);
  }
}

const Clock: React.FC = () => {
  const time = useSelector((state: RootState) => state.playback.time);
  const { minutes, seconds, miliSecs } = formatTime(time);
  const strMiliSecs = miliSecs.toString().slice(2);

  return (
    <Wrapper>
      <Mins>
        <TimeLabel>{padStr(minutes.toString(), '0', 2)}</TimeLabel>
      </Mins>
      <Colon>
        <TimeLabel>:</TimeLabel>
      </Colon>
      <Secs>
        <TimeLabel>{padStr(seconds.toString(), '0', 2)}</TimeLabel>
      </Secs>
      <TimeLabel>.</TimeLabel>
      <MiliSecs>
        <MiliSecLabel>{padStr(strMiliSecs, '0', 2, true)}</MiliSecLabel>
      </MiliSecs>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #1c1e2c;
  height: 50px;
  width: 150px;
`;

const TimeLabel = styled(Label)`
  color: #b0cae2;
  font-size: 25px;
  font-family: sans-serif;
`;

const MiliSecLabel = styled(TimeLabel)`
  font-size: 20px;
`;

const Mins = styled.div``;

const Secs = styled.div``;

const MiliSecs = styled.div`
  padding-top: 3px;
`;

const Colon = styled.div`
  padding-bottom: 3px;
`;

export default Clock;
