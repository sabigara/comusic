import React, { useState } from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';
import Color from '../common/Color';

type Props = {
  isActive: boolean;
  id?: string;
  setActive?: Function;
  onClick?: Function;
  isLeftMost?: boolean;
  isRightMost?: boolean;
};

const ToolBarItem: React.FC<Props> = (props) => {
  const {
    isActive,
    id,
    setActive,
    onClick,
    children,
    isLeftMost,
    isRightMost,
  } = props;

  const [mouseDown, setMouseDown] = useState(false);

  return (
    <Wrapper
      id={id}
      mouseDown={mouseDown}
      isActive={isActive}
      isLeftMost={isLeftMost}
      isRightMost={isRightMost}
      onClick={() => {
        onClick && onClick();
        setActive && setActive(!isActive);
      }}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  mouseDown: boolean;
  isActive: boolean;
  isLeftMost?: boolean;
  isRightMost?: boolean;
}>`
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ isLeftMost, isRightMost }) => {
    if (isLeftMost && !isRightMost) {
      return '4px 0 0 4px';
    } else if (isRightMost && !isLeftMost) {
      return '0 4px 4px 0';
    } else if (isLeftMost && isRightMost) {
      return '4px';
    }
  }};
  background-color: ${(props) => {
    const base = props.isActive
      ? Color.ToolBarItem.Active
      : Color.ToolBarItem.InActive;
    return props.mouseDown
      ? tinycolor(base)
          .darken(8)
          .toHexString()
      : base;
  }};
`;

export default ToolBarItem;
