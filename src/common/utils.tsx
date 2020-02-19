/* eslint-disable react/display-name */

import React from 'react';

export function styledScrollRenderer(extraStyle: React.CSSProperties) {
  return {
    renderer: ({ elementRef, style, ...rest }: any) => {
      return (
        <div {...rest} ref={elementRef} style={{ ...style, ...extraStyle }} />
      );
    },
  };
}

export function disabledScrollRenderer() {
  return {
    renderer: ({ elementRef }: any) => {
      return <div ref={elementRef} style={{ display: 'none' }} />;
    },
  };
}
