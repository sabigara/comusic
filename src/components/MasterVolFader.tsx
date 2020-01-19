import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import useAudioAPI from '../hooks/useAudioAPI';
import { changeMasterVolume } from '../actions/playback';
import Fader from '../atoms/Fader';

const MasterVolume: React.FC = () => {
  const state = useSelector((state: any) => state.playback.masterVolume);
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const [ wavePeak, setWavePeak ] = React.useState(0);

  useEffect(() => {
    audioAPI.setMasterVolume(state);
  }, [state, audioAPI]);

  useEffect(() => {
    const interval = setInterval(() => {
      const peak = audioAPI.masterPeak;
      setWavePeak(peak ? peak * 0.5 : 0);
    }, 50);
    return () => clearInterval(interval);
  }, [audioAPI]);

  return (
    <Fader
      onChange={(e, vol) => {
        dispatch(changeMasterVolume(vol));
      }}
      onChangeCommitted={(e, val) => {}}
      onMouseDown={() => {}}
      orientation="horizontal"

      max={1}
      min={0}
      step={0.01}
      value={state}
      wavePeak={wavePeak}
      type='volume'
      railHeight={12}
      knobHeight={23}
      knobWidth={23}
    />
  );
}


export default MasterVolume;
