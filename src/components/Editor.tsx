import React, { useRef } from 'react';
import styled from 'styled-components';

import { useFetchVerContents } from '../hooks/versions';
import TrackList from './TrackList';
import WaveformList from './WaveformList';

type Props = {
  verId: string;
};

const Editor: React.FC<Props> = ({ verId }) => {
  const refTrk = useRef<HTMLDivElement>(null);
  const refWav = useRef<HTMLDivElement>(null);
  // e: React.UIEvent<HTMLDivElement> doesn't supply e.scrollLeft
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
    <Container>
      <TrackList
        verId={verId}
        paddingBottom={paddingBottom}
        ref={refTrk}
        onScroll={onScrollTrk}
      />
      <WaveformList
        verId={verId}
        paddingBottom={paddingBottom}
        ref={refWav}
        onScroll={onScrollWav}
      />
    </Container>
  );
};

const Container = styled.div`
  flex-grow: 1;
  display: flex;
`;

export default Editor;
