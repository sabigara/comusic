/* eslint-disable react/display-name */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';

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

type Props = {
  onScroll: any;
};

const WaveformList = React.forwardRef(({ onScroll }: Props, refWav: any) => {
  const trackIds = useSelector((state: RootState) => {
    return state.tracks.allIds;
  });

  const playback = useSelector(
    (state: RootState) => state.playback,
    (prev, current) => prev.status === current.status,
  );

  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const refDiv = useRef<HTMLDivElement>(null);
  const refLoc = useRef<HTMLDivElement>(null);

  const onScrollWav = (e: any) => {
    onScroll(e);
    refLoc.current?.scrollTo(e.scrollLeft, refLoc.current?.scrollTop);
  };

  const onScrollLoc = (e: any) => {
    refWav.current?.scrollTo(e.scrollLeft, refWav.current?.scrollTop);
  };

  const onSomewhereClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    if (!refDiv.current) return;

    let left = e.clientX - refDiv.current.getBoundingClientRect().left;
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
      <Scrollbar
        ref={refLoc as any}
        onScroll={onScrollLoc}
        trackXProps={{
          renderer: ({ elementRef }: any) => {
            return <div ref={elementRef} />;
          },
        }}
        wrapperProps={{ style: { bottom: 0 } }}
        style={{ height: 20 }}
      >
        <Locator />
      </Scrollbar>
      <Scrollbar
        ref={refWav}
        onScroll={onScrollWav}
        scrollerProps={{
          renderer: (props) => {
            const { elementRef, style, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                style={{ ...style, marginBottom: -25 }}
                className="ScrollbarsCustom-Scroller"
              />
            );
          },
        }}
        trackXProps={{
          renderer: ({ elementRef, style, ...rest }: any) => {
            return (
              <div {...rest} ref={elementRef} style={{ ...style, left: 0 }} />
            );
          },
        }}
      >
        <Cursor offset={0} />
        <div id="waveform-parent" ref={refDiv}>
          {trackIds.map((trackId, i) => {
            return (
              <WaveformWrapper key={`waveform-${i}`}>
                <Waveform trackId={trackId} />
              </WaveformWrapper>
            );
          })}
        </div>
      </Scrollbar>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${Color.Waveform.Background};
  overflow: hidden;
  padding-left: ${PADDING_LEFT.toString() + 'px'};
`;

const WaveformWrapper = styled.div`
  height: 130px;
`;

export default WaveformList;
