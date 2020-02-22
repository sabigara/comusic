import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import Label from '../atoms/Label';
import More from '../atoms/More';
import { useChangeActiveTake } from '../hooks/tracks';
import { useTakes, useActiveTakeId } from '../hooks/selectors';
import { useAddTake } from '../hooks/takes';
import TakeCtxMenu from './TakeCtxMenu';

type Props = {
  trackId: string;
};

const TakeList: React.FC<Props> = ({ trackId }) => {
  const takes = useTakes(trackId);
  const activeTakeId = useActiveTakeId(trackId);
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseHoverId, setMouseHoverId] = useState<string | null>(null);
  const addTake = useAddTake();
  const changeActiveTake = useChangeActiveTake(trackId);

  const onFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      if (!file) return;
      // Remove file from input element to enable
      // submitting the same file multiple times.
      e.target.value = '';
      const body = new FormData();
      body.append('name', file.name);
      body.append('file', file);
      addTake(trackId, body);
    },
    [trackId, addTake],
  );
  const onTakeChange = (id: string) => {
    if (id !== activeTakeId) {
      changeActiveTake(id);
    }
  };

  return (
    <Wrapper
      mouseOver={mouseOver}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {takes.map((take) => {
        return (
          <TakeButton
            className="take-button"
            key={take.id}
            data-testid={`take-button-${take.id}`}
            onClick={() => onTakeChange(take.id)}
            onMouseEnter={() => setMouseHoverId(take.id)}
            onMouseLeave={() => setMouseHoverId(null)}
            isActive={take.id === activeTakeId}
          >
            <ButtonLabel>{take.name}</ButtonLabel>
            {mouseHoverId === take.id ? (
              <TakeCtxMenu takeId={take.id}>
                <MoreWrapper onClick={(e) => e.stopPropagation()}>
                  <More />
                </MoreWrapper>
              </TakeCtxMenu>
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
