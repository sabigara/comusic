/* eslint-disable react/display-name */
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';

import Color from '../common/Color';
import { RootState } from '../reducers';
import { useFetchVerContents } from '../hooks/versions';
import { useAddTrack } from '../hooks/tracks';
import Track from './Track';

const verId = '6f3291f3-ec12-409d-a3ba-09e813bd96ba';

type Props = {
  onScroll: any;
};

const TrackList = React.forwardRef(({ onScroll }: Props, ref: any) => {
  const tracks = useSelector((state: RootState) => {
    return state.tracks.allIds;
  });

  const addTrack = useAddTrack(verId);
  useFetchVerContents(verId);

  return (
    <Scrollbar
      ref={ref}
      trackYProps={{
        renderer: ({ elementRef }: any) => {
          return <div ref={elementRef} />;
        },
      }}
      wrapperProps={{ style: { right: 0 } }}
      style={{ width: '520px' }}
      onDoubleClick={addTrack}
      onScroll={onScroll}
    >
      <Wrapper>
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
      </Wrapper>
    </Scrollbar>
  );
});

const Wrapper = styled.div`
  background-color: ${Color.Track.Background};
  padding-top: 19px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TrackWrapper = styled.div`
  height: 129px;
`;

const SeparatorH = styled.div`
  height: 1px;
  background-color: #777;
`;

export default TrackList;
