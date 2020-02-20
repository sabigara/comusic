/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/display-name */
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';

import Color from '../common/Color';
import { styledScrollRenderer, disabledScrollRenderer } from '../common/utils';
import { RootState } from '../reducers';
import { useAddTrack } from '../hooks/tracks';
import Track from './Track';

type Props = {
  verId: string;
  paddingBottom: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

const TrackList = React.forwardRef(
  ({ verId, paddingBottom, onScroll }: Props, ref: any) => {
    const tracks = useSelector((state: RootState) => {
      return state.tracks.allIds;
    });
    const addTrack = useAddTrack(verId);

    return (
      <Scrollbar
        ref={ref as any}
        style={scroll}
        wrapperProps={styledScrollRenderer(scrollWrapper)}
        contentProps={styledScrollRenderer(scrollContent(paddingBottom))}
        trackYProps={disabledScrollRenderer()}
        onDoubleClick={addTrack}
        // https://github.com/xobotyi/react-scrollbars-custom/issues/109
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onScroll={onScroll as any}
      >
        {tracks.map((trackId, i) => {
          return (
            <div
              key={`trk-${trackId}`}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <SeparatorH />
              <TrackWrapper>
                <Track trackId={trackId} />
              </TrackWrapper>
              {i === tracks.length - 1 ? <SeparatorH /> : null}
            </div>
          );
        })}
      </Scrollbar>
    );
  },
);

const scroll = { width: 520 };
const scrollWrapper = { right: 0 };
const scrollContent = (paddingBottom: number) => {
  return {
    background: Color.Track.Background,
    paddingTop: 19,
    height: 'auto',
    paddingBottom: paddingBottom,
  };
};

const TrackWrapper = styled.div`
  height: 129px;
`;

const SeparatorH = styled.div`
  height: 1px;
  background-color: #777;
`;

export default TrackList;
