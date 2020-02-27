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

export function uniqueArray<T>(array: T[]) {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
}
