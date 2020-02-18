import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PlaybackStatus } from '../common/Domain';
import { RootState } from '../reducers';
import { updateTime } from '../actions/playback';
import useAudioAPI from '../hooks/useAudioAPI';
import { pixelsToSeconds } from '../common/conversions';
import styled from 'styled-components';
import Color from '../common/Color';
import Waveform from './Waveform';
import Locator from './Locator';
import Cursor from './Cursor';

const PADDING_LEFT = 20;

const WaveformList: React.FC = () => {
  const trackIds = useSelector((state: RootState) => {
    return state.tracks.allIds;
  });

  const playback = useSelector(
    (state: RootState) => state.playback,
    (prev, current) => prev.status === current.status,
  );

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const ref = useRef<HTMLDivElement>(null);

  const onSomewhereClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    if (!ref.current) return;

    let left = e.clientX - ref.current.getBoundingClientRect().left;
    if (left < 0) {
      left = 0;
    }
    const time = pixelsToSeconds(
      left,
      audioAPI.resolution,
      audioAPI.sampleRate,
    );
    dispatch(updateTime(time));
    if (playback.status === PlaybackStatus.Playing) {
      audioAPI.stop();
      audioAPI.play(time);
    }
  };

  return (
    <Wrapper onClick={onSomewhereClick}>
      <Locator />
      <Cursor offset={PADDING_LEFT} />
      <div id="waveform-parent" ref={ref}>
        {trackIds.map((trackId, i) => {
          return (
            <WaveformWrapper key={`waveform-${i}`}>
              <Waveform trackId={trackId} />
            </WaveformWrapper>
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  flex-grow: 1;
  background-color: ${Color.Waveform.Background};
  overflow-x: auto;
  overflow-y: visible;
  padding-left: ${PADDING_LEFT.toString() + 'px'};
  &::-webkit-scrollbar {
    background-color: ${Color.Waveform.Background};
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
    height: 4px;
  }
`;

const WaveformWrapper = styled.div`
  height: 130px;
`;

export default WaveformList;
