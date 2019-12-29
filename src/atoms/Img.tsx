import React from 'react';
import styled from 'styled-components';

type Props = {
  src: string,
  alt: string,
}

const Img: React.FC<Props> = ({ src, alt }) => {
  return (
    <StyledImg src={src} alt={alt}/>
  );
};

const StyledImg = styled.img`
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
`

export default Img;