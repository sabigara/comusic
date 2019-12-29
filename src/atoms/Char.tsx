import React from 'react';
import styled from 'styled-components';


const Char: React.FC = ({ children }) => {
  return (
    <StyledChar>{children}</StyledChar>
  )
};

const StyledChar = styled.span`
  color: white;
  font-family: sans-serif;
  font-size: 12px;
  cursor: default;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
`

export default Char