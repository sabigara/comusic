import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Color from '../common/Color';
import Label from '../atoms/Label';
import More from '../atoms/More';

import { changeActiveTake } from '../actions/tracks';
import { uploadTakeFile } from '../actions/takes';

import { RootState } from '../reducers';

type Props = {
  trackId: string;
};

const TakeList: React.FC<Props> = ({ trackId }) => {
  const takes = useSelector((state: RootState) => {
    return state.takes.allIds
      .map((id) => state.takes.byId[id])
      .filter((take) => take.trackId === trackId);
  });
  const activeTake = useSelector((state: RootState) => {
    const activeTakeId = state.tracks.byId[trackId].activeTake;
    return state.takes.byId[activeTakeId];
  });
  console.log(trackId);
  const dispatch = useDispatch();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseHoverId, setMouseHoverId] = useState<string | null>(null);

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      const body = new FormData();
      body.append('name', file.name);
      body.append('file', file);
      dispatch(uploadTakeFile(trackId, body));
    },
    [],
  );

  return (
    <Wrapper
      mouseOver={mouseOver}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {takes.map((take, i) => {
        return (
          <TakeButton
            onMouseEnter={() => setMouseHoverId(take.id)}
            onMouseLeave={() => setMouseHoverId(null)}
            key={i}
            isActive={activeTake && take.id === activeTake.id}
            onClick={() => {
              if (activeTake && take.id !== activeTake.id) {
                dispatch(changeActiveTake(trackId, take.id));
              }
            }}
          >
            <ButtonLabel>{take.name}</ButtonLabel>
            {mouseHoverId === take.id ? (
              <MoreWrapper onClick={(e) => e.stopPropagation()}>
                <More />
              </MoreWrapper>
            ) : null}
          </TakeButton>
        );
      })}
      <label htmlFor={`take-upload-${trackId}`}>
        <UploadButton>
          <UploadButtonLabel>+ Upload</UploadButtonLabel>
        </UploadButton>
      </label>
      <input
        onChange={onFileSelected}
        type="file"
        id={`take-upload-${trackId}`}
        accept="audio/*"
        style={{ display: 'none' }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ mouseOver: boolean }>`
  background-color: ${Color.Track.Background};
  width: 150px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    background-color: ${Color.Track.Background};
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
    width: 4px;
    display: ${(props) => (props.mouseOver ? null : 'none')};
  }
`;

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
`;

const TakeButton = styled(Button)<{ isActive: boolean }>`
  background-color: ${(props) => {
    return props.isActive ? Color.Button.MuteOn : Color.Button.Disabled;
  }};
`;

const UploadButton = styled(Button)`
  background-color: #0395eb;
  cursor: pointer;
`;

const ButtonLabel = styled(Label)`
  font-size: 14px;
`;

const UploadButtonLabel = styled(ButtonLabel)`
  cursor: pointer;
  font-size: 13px;
`;

const MoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 14px;
  cursor: pointer;
`;

export default TakeList;
