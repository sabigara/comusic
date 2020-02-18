import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import { RootState } from '../reducers';
import { useFetchVerContents } from '../hooks/versions';
import { useAddTrack } from '../hooks/tracks';
import useAudioAPI from '../hooks/useAudioAPI';
import Track from './Track';

const verId = '6f3291f3-ec12-409d-a3ba-09e813bd96ba';

const TrackList: React.FC = () => {
  const tracks = useSelector((state: RootState) => {
    return state.tracks.allIds;
  });

  const audioAPI = useAudioAPI();
  const addTrack = useAddTrack(verId);
  useFetchVerContents(verId);

  useEffect(() => {
    return () => {
      Object.values(audioAPI.tracks).map((trackAPI) => {
        trackAPI.release();
      });
    };
  }, [audioAPI, tracks]);

  return (
    <Wrapper onDoubleClick={addTrack}>
      {tracks.map((trackId, i) => {
        return (
          <div key={`track-${i}`} onDoubleClick={(e) => e.stopPropagation()}>
            <SeparatorH />
            <TrackWrapper>
              <Track trackId={trackId} />
            </TrackWrapper>
            {i === tracks.length - 1 ? <SeparatorH /> : null}
          </div>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${Color.Track.Background};
  padding-top: 20px;
`;

const TrackWrapper = styled.div`
  height: 129px;
`;

const SeparatorH = styled.div`
  height: 1px;
  background-color: #777;
`;

export default TrackList;
