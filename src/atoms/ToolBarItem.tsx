import React from 'react';
import styled from 'styled-components';

import Color from '../common/Color';

type Props = {
  isActive: boolean,
  setActive: Function,
  onClick: Function,
  isLeftMost?: boolean,
  isRightMost?: boolean,
}

const ToolBarItem: React.FC<Props> = (props) => {
  const {
    isActive,
    setActive,
    onClick,
    children,
    isLeftMost,
    isRightMost,
  } = props;

  return (
    <Wrapper
      isActive={isActive}
      isLeftMost={isLeftMost}
      isRightMost={isRightMost}
      onClick={() => {
        onClick();
        setActive(!isActive);
      }}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  isActive: boolean,
  isLeftMost?: boolean,
  isRightMost?: boolean,
}>`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${ ({ isLeftMost, isRightMost }) => {
    // Returns 0 if [true, true] or [false, false]
    if (isLeftMost === isRightMost && isLeftMost === false) { return '0' }
    if (isLeftMost) {
      return '4px 0 0 4px'
    } else if (isRightMost) {
      return '0 4px 4px 0'
    }
  }};
  background-color: ${props => {
      return props.isActive 
        ? Color.ToolBarItem.Active
        : Color.ToolBarItem.InActive
    }};
`

export default ToolBarItem;