import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import useAudioAPI from '../hooks/useAudioAPI';
import Color from '../common/Color';
import Label from '../atoms/Label';
import More from '../atoms/More';

import { changeActiveTake } from '../actions/trackList';

type Take = {
  id: string,
  name: string,
  fileURL: string,
}

type Props = {
  trackId: string,
}

const TakeList: React.FC<Props> = ({ trackId }) => {
  const state = useSelector((state: any) => {
    const track = state.trackList.filter((track: any) => track.id === trackId);
    return track ? track[0] : null
  },
    (prev, current) => prev.activeTakeId === current.activeTakeId
  );

  const [ mouseOver, setMouseOver] = useState(false);
  const [ mouseHoverId, setMouseHoverId ] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();

  const activeTakeURL = state.takeList.filter((take) => take.id === state.activeTakeId)[0].fileURL

  useEffect(() => {
    audioAPI.getTrack(trackId)!.loadFile(activeTakeURL);
  }, [audioAPI, trackId, activeTakeURL]);

  return (
    <Wrapper
      mouseOver={mouseOver}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {
        state.takeList.map((take, i) => {
          return (
            <TakeButton
              onMouseEnter={() => setMouseHoverId(take.id)}
              onMouseLeave={() => setMouseHoverId(null)}
              key={i}
              isActive={take.id === state.activeTakeId}
              onClick={(e) => {
                dispatch(changeActiveTake(trackId, take.id));
              }}
            >
              <ButtonLabel>{take.name}</ButtonLabel>
              {
                mouseHoverId === take.id
                ? <MoreWrapper onClick={(e) => e.stopPropagation()}><More/></MoreWrapper>
                : null
              }
            </TakeButton>
          );
        })
      }
      <label htmlFor="take_upload">
        <UploadButton>
         <UploadButtonLabel>+ Upload</UploadButtonLabel>
        </UploadButton>
      </label>
      <input
        type="file"
        id="take_upload"
        accept="audio/*"
        style={{display: 'none'}}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<{mouseOver: boolean}>`
  background-color: ${Color.Background};
  width: 150px;
  height: 170px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    background-color: ${Color.Background};
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
    width: 4px;
    display: ${props => props.mouseOver ? null : 'none'};
  }
`

const Button = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border: solid 1px ${Color.Border};
  box-sizing: border-box;
  width: 120px;
  height: 26px;
  margin: 7px auto;
  padding: 0 0 0 5px;
`

const TakeButton = styled(Button)<{isActive: boolean}>`
  background-color: ${props => {
    return props.isActive ? Color.Button.MuteOn : Color.Button.Disabled;
  }};
`

const UploadButton = styled(Button)`
  background-color: #0395EB;
  cursor: pointer;
`

const ButtonLabel = styled(Label)`
  font-size: 14px;
`

const UploadButtonLabel = styled(ButtonLabel)`
  cursor: pointer;
  font-size: 13px;
`

const MoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 14px;
  cursor: pointer;
`

export default TakeList;
