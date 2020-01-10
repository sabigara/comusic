import React, { useEffect, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import useAudioAPI from '../hooks/useAudioAPI';
import { secondsToPixels } from '../common/conversions';
import styled from 'styled-components';

const Locator: React.FC = () => {
  const state = useSelector(
    (state: any) => state.trackList.map(track => track.isTakeLoading),
    shallowEqual
  );

  const audioAPI = useAudioAPI();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(()=> {
    const maxLength = Math.max(...audioAPI.trackList.map(track => track.duration));
    const canvas = ref!.current!;
    canvas.width = secondsToPixels(maxLength, audioAPI.resolution, audioAPI.sampleRate) + 100;
    canvas.height = 20;
    const cc = canvas.getContext('2d')!;
    cc.clearRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#aaa';

    for (let i = 0; i < maxLength; i++) {
      const px = secondsToPixels(i, audioAPI.resolution, audioAPI.sampleRate);
      cc.fillRect(px, 10, 1, 10);
    }

  }, [audioAPI.resolution, audioAPI.sampleRate, audioAPI.trackList, state]);

  return (
    <Wrapper>
      <Canvas
        ref={ref}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: auto;
  height: 20px;
`

const Canvas = styled.canvas`
`

export default Locator;
