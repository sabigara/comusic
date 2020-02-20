/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/display-name */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';

import { PlaybackStatus } from '../common/Domain';
import { styledScrollRenderer, disabledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { updateTime } from '../actions/playback';
import useAudioAPI from '../hooks/useAudioAPI';
import { pixelsToSeconds } from '../common/conversions';
import styled from 'styled-components';
import Color from '../common/Color';
import Waveform from './Waveform';
import Locator from './Locator';
import Cursor from './Cursor';

type Props = {
  paddingBottom: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

const WaveformList = React.forwardRef(
  ({ paddingBottom, onScroll }: Props, refWav: any) => {
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
      <Wrapper>
        <Scrollbar
          ref={refLoc as any}
          // https://github.com/xobotyi/react-scrollbars-custom/issues/109
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onScroll={onScrollLoc as any}
          style={scrollLoc}
          wrapperProps={styledScrollRenderer(scrollWrapperLoc)}
          trackXProps={disabledScrollRenderer()}
        >
          <Locator />
        </Scrollbar>
        <Scrollbar
          ref={refWav}
          onScroll={onScrollWav as any}
          scrollerProps={{
            ...styledScrollRenderer(scrollScrollerWav),
            onClick: onSomewhereClick,
          }}
          trackXProps={styledScrollRenderer(scrollTrackXWav)}
          wrapperProps={styledScrollRenderer(scrollWrapperWav)}
          contentProps={styledScrollRenderer(scrollContentWav(paddingBottom))}
          thumbXProps={styledScrollRenderer(scrollThumbWav)}
          thumbYProps={styledScrollRenderer(scrollThumbWav)}
        >
          <Cursor offset={0} />
          <div id="waveform-parent" ref={refDiv}>
            {trackIds.map((trackId) => {
              return (
                <WaveformWrapper key={`wf-${trackId}`}>
                  <Waveform trackId={trackId} />
                </WaveformWrapper>
              );
            })}
          </div>
        </Scrollbar>
      </Wrapper>
    );
  },
);

const scrollLoc = { height: 20 };
const scrollWrapperLoc = { bottom: 0 };

const scrollScrollerWav = { marginBottom: -25 };
const scrollTrackXWav = { left: 0 };
const scrollWrapperWav = { right: 0, bottom: 0 };
const scrollThumbWav = { background: '#FFFFFF55' };
// Redundant type annotation to conform CSSProperty interface.
const scrollContentWav = (
  paddingBottom: number,
): { position: 'relative'; paddingBottom: number } => {
  return {
    position: 'relative',
    paddingBottom: paddingBottom,
  };
};

const Wrapper = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${Color.Waveform.Background};
  overflow: hidden;
  padding-left: 20px;
`;

const WaveformWrapper = styled.div`
  height: 130px;
`;

export default WaveformList;
