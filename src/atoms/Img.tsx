import React from 'react';
import styled from 'styled-components';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const StyledImg = styled.img<Props>`
  width: ${(props) => (props.width ? props.width + 'px' : null)};
  height: ${(props) => (props.height ? props.height + 'px' : null)};
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
`;

export default StyledImg;
