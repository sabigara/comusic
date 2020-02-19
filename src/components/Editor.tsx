import React, { useRef } from 'react';
import styled from 'styled-components';

import { useFetchVerContents } from '../hooks/versions';
import TrackList from './TrackList';
import WaveformList from './WaveformList';

const verId = '6f3291f3-ec12-409d-a3ba-09e813bd96ba';

const Editor: React.FC = () => {
  const refTrk = useRef<HTMLDivElement>(null);
  const refWav = useRef<HTMLDivElement>(null);
  const onScrollTrk = (e: any) => {
    if (e.scrollLeft) {
      refWav.current?.scrollTo(e.scrollLeft, refWav.current?.scrollTop);
    } else {
      refWav.current?.scrollTo(refWav.current?.scrollLeft, e.scrollTop);
    }
  };
  const onScrollWav = (e: any) => {
    refTrk.current?.scrollTo(0, e.scrollTop);
  };
  useFetchVerContents(verId);

  const paddingBottom = 52;

  return (
    <FixedHeightContainer>
      <TrackList
        paddingBottom={paddingBottom}
        verId={verId}
        ref={refTrk}
        onScroll={onScrollTrk}
      />
      <WaveformList
        paddingBottom={paddingBottom}
        ref={refWav}
        onScroll={onScrollWav}
      />
    </FixedHeightContainer>
  );
};

const FixedHeightContainer = styled.div`
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
`;

export default Editor;
