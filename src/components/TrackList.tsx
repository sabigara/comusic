import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import TrackPanel from './TrackPanel';
import TakeList from './TakeList';

const TrackList: React.FC = () => {
  const state = useSelector((state: any) => state.trackList);
  const dispatch = useDispatch();

  return (
    <Wrapper>
      {
        state.map((track) => {
          return (
            <div>
              <TrackWrapper>
                <TrackPanel trackId={track.id}/>
                <SeparatorV/>
                <TakeList
                  takeList={track.takeList}
                  trackId={track.id}
                  activeTakeId={track.activeTakeId}
                />
                <Spacer/>
                <SeparatorV/>
              </TrackWrapper>
              <SeparatorH/>
            </div>
          )
        })
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${Color.Background};
`

const TrackWrapper = styled.div`
  display: flex;
`

const SeparatorV = styled.div`
  width: 2px;
  background-color: #777;
`

const SeparatorH = styled.div`
  height: 2px;
  background-color: #777;
`

const Spacer = styled.div`
  width: 5px;
`

export default TrackList;
