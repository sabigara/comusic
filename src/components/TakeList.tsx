import React, { useState } from 'react';
import styled from 'styled-components';

import Color from '../common/Color';
import Label from '../atoms/Label';
import More from '../atoms/More';

type Take = {
  id: string,
  name: string,
}

type Props = {
  takeList: Take[],
}

const TakeList: React.FC<Props> = ({ takeList }) => {
  const [ activeTakeId, setActiveTake ] = useState('1');
  const [ mouseOver, setMouseOver] = useState(false);
  const [ mouseHoverId, setMouseHoverId ] = useState<string | null>(null);

  return (
    <Wrapper
      mouseOver={mouseOver}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {
        takeList.map((take, i) => {
          return (
            <TakeButton
              onMouseEnter={() => setMouseHoverId(take.id)}
              onMouseLeave={() => setMouseHoverId(null)}
              key={i}
              isActive={take.id === activeTakeId}
              onClick={(e) => {
                setActiveTake(take.id);
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

const TakeButton = styled.div<{isActive: boolean}>`
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
  background-color: ${props => {
    return props.isActive ? Color.Button.MuteOn : Color.Button.Disabled;
  }};
`

const ButtonLabel = styled(Label)`
  font-size: 14px;
`

const MoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 14px;
  cursor: pointer;
`

export default TakeList;
