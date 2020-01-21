import React, { useEffect, useRef } from 'react';

import useLoading from '../hooks/useLoading';
import useAudioAPI from '../hooks/useAudioAPI';
import { secondsToPixels } from '../common/conversions';
import styled from 'styled-components';

const Locator: React.FC = () => {
  const loadingTake = useLoading('LOAD_ACTIVE_TAKE');
  const audioAPI = useAudioAPI();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loadingTake) return;

    const maxLength = Math.max(
      ...Object.values(audioAPI.tracks).map((track) => track.duration),
    );
    const canvas = ref!.current!;
    canvas.width =
      secondsToPixels(maxLength, audioAPI.resolution, audioAPI.sampleRate) +
      100;
    canvas.height = 20;
    const cc = canvas.getContext('2d')!;
    cc.clearRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#aaa';

    for (let i = 0; i < maxLength; i++) {
      const px = secondsToPixels(i, audioAPI.resolution, audioAPI.sampleRate);
      cc.fillRect(px, 10, 1, 10);
    }
  }, [audioAPI.resolution, audioAPI.sampleRate, audioAPI.tracks, loadingTake]);

  return (
    <Wrapper>
      <Canvas ref={ref} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: auto;
  height: 20px;
`;

const Canvas = styled.canvas``;

export default Locator;
