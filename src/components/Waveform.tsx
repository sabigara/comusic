import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import useAudioAPI from '../hooks/useAudioAPI';

type Props = {
  trackId: string,
}

const drawFrame = (cc, h2, x, minPeak, maxPeak) => {
  const min = Math.abs(minPeak * h2);
  const max = Math.abs(maxPeak * h2);
  // draw max
  cc.fillRect(x, 0, 1, h2 - max);
  // draw min
  cc.fillRect(x, h2 + min, 1, h2 - min);
}

const Waveform: React.FC<Props> = ({ trackId }) => {
  const state = useSelector((state: any) => {
    const track = state.trackList.filter((track: any) => track.id === trackId);
    return track ? track[0] : null
  }, (prev, current) => {
    return prev.id === current.id
  });

  const ref = useRef<HTMLCanvasElement>(null);
  const audioAPI = useAudioAPI();
  const trackAPI = audioAPI.getTrack(state.id)!;

  const peakList = trackAPI.getPeakList();
  const peakListData = peakList.data[0];
  const offset = 0;

  useEffect(()=> {
    const canvas = ref!.current!;
    canvas.width = peakListData.length / 2;
    const cc = canvas.getContext('2d')!;
    const h2 = canvas.height / 2;
    const maxValue = 2 ** (peakList.bits - 1);

    cc.clearRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#AAA';

    for (let i = 0; i < peakListData.length; i += 1) {
      const minPeak = peakListData[(i + offset) * 2] / maxValue;
      const maxPeak = peakListData[((i + offset) * 2) + 1] / maxValue;
      drawFrame(cc, h2, i, minPeak, maxPeak);
    }

  }, [peakListData, peakList.bits]);

  return (
    <Wrapper>
      <Canvas
        ref={ref}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  height: auto;
`

const Canvas = styled.canvas`
  height: 150px;
`

export default Waveform;
