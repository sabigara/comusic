import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useLoading } from '../hooks/loading';
import useAudioAPI from '../hooks/useAudioAPI';
import { RootState } from '../reducers';

type Props = {
  trackId: string;
};

const drawFrame = (
  cc: CanvasRenderingContext2D,
  h2: number,
  x: number,
  minPeak: number,
  maxPeak: number,
) => {
  const min = Math.abs(minPeak * h2);
  const max = Math.abs(maxPeak * h2);
  // draw max
  cc.fillRect(x, 0, 1, h2 - max);
  // draw min
  cc.fillRect(x, h2 + min, 1, h2 - min);
};

const Waveform: React.FC<Props> = ({ trackId }) => {
  const loadingTake = useLoading('LOAD_ACTIVE_TAKE', trackId);
  const activeTake = useSelector((state: RootState) => {
    const activeTakeId = state.tracks.byId[trackId].activeTake;
    return state.takes.byId[activeTakeId];
  });
  const dispatch = useDispatch();
  const ref = useRef<HTMLCanvasElement>(null);
  const audioAPI = useAudioAPI();
  const offset = 0;

  useEffect(() => {
    if (loadingTake) return;
    if (!ref.current) return;
    const canvas = ref.current;
    canvas.height = 130;
    const cc = canvas.getContext('2d');
    if (!cc) return;
    if (!activeTake) {
      cc.clearRect(0, 0, canvas.width, canvas.height);
    }

    const peakList = audioAPI.getTrack(trackId)?.getPeakList();
    if (!peakList) return;

    const peakListData = peakList.data[0];
    canvas.width = peakListData.length / 2;
    const h2 = canvas.height / 2;
    const maxValue = 2 ** (peakList.bits - 1);

    cc.clearRect(0, 0, canvas.width, canvas.height);
    cc.fillStyle = '#AAA';

    for (let i = 0; i < peakListData.length; i += 1) {
      const minPeak = peakListData[(i + offset) * 2] / maxValue;
      const maxPeak = peakListData[(i + offset) * 2 + 1] / maxValue;
      drawFrame(cc, h2, i, minPeak, maxPeak);
    }
  }, [audioAPI, dispatch, loadingTake, trackId, activeTake]);

  return <Wrapper>{loadingTake ? null : <Canvas ref={ref} />}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  height: auto;
`;

const Canvas = styled.canvas``;

export default Waveform;
