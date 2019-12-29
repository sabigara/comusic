import React, { Children, cloneElement } from 'react';
import styled from 'styled-components';

import Color from '../common/Color';

const ToolBarItemContainer: React.FC = (props) => {
  const { children } = props;
  const childrenArray = Children.toArray(children)

  return (
    <Wrapper>
      {
        childrenArray.map((child, i) => {
          const isLeftMost = i === 0;
          const isRightMost = i === childrenArray.length - 1
          return (
            <ItemWrapper key={i}>
              {cloneElement(child as any, {isLeftMost, isRightMost})}
              {i < childrenArray.length - 1 ? <Separator /> : null}
            </ItemWrapper>
          );
        })
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 4px;
	display : -webkit-inline-box;
	display : -ms-inline-flexbox;
	display : -webkit-inline-flex;
	display : inline-flex;
`

const ItemWrapper = styled.div`
  display: flex;
`

const Separator = styled.div`
  background-color: ${Color.Border};
  width: 1px;
  height: 100%;
`

export default ToolBarItemContainer;