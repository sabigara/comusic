import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import { fetchVerContents } from '../actions/versions';
import { RootState } from '../reducers';
import { TrackState } from '../reducers/tracks';
import Track from './Track';

const hasStateChanged = (prev: TrackState[], current: TrackState[]) => {
  return prev.reduce((isEqual, track, i) => {
    return isEqual || track.id === current[i].id;
  }, false);
};

const TrackList: React.FC = () => {
  const state = useSelector(
    (state: RootState) => {
      return state.tracks.allIds.map((id: string) => state.tracks.byId[id]);
    },
    (prev, current) => {
      // Re-rendering should happen only when track(s) is inserted or deleted.
      // (Not when volume of a track changed, for example.)
      if (prev.length !== current.length) {
        return false;
      } else {
        return hasStateChanged(prev, current);
      }
    },
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchVerContents('6f3291f3-ec12-409d-a3ba-09e813bd96ba'));
  }, [dispatch]);

  return (
    <Wrapper>
      {state.map((track, i) => {
        return (
          <div key={`track-${i}`}>
            <SeparatorH />
            <TrackWrapper>
              <Track trackId={track.id} />
            </TrackWrapper>
            {i === state.length - 1 ? <SeparatorH /> : null}
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
  height: 169px;
`;

const SeparatorH = styled.div`
  height: 1px;
  background-color: #777;
`;

export default TrackList;
