import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../reducers';
import useAudioAPI from '../hooks/useAudioAPI';
import { changeMasterVolume } from '../actions/playback';
import Fader from '../atoms/Fader';

const MasterVolume: React.FC = () => {
  const master = useSelector((state: RootState) => state.playback.masterVolume);
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const [wavePeak, setWavePeak] = React.useState(0);

  useEffect(() => {
    audioAPI.setMasterVolume(master);
  }, [master, audioAPI]);

  useEffect(() => {
    const interval = setInterval(() => {
      const peak = audioAPI.masterPeak;
      setWavePeak(peak ? peak * 0.5 : 0);
    }, 50);
    return () => clearInterval(interval);
  }, [audioAPI]);

  return (
    <Fader
      onChange={(_, vol) => {
        dispatch(changeMasterVolume(vol));
      }}
      orientation="horizontal"
      max={1}
      min={0}
      step={0.01}
      value={master}
      wavePeak={wavePeak}
      type="volume"
      railHeight={12}
      knobHeight={23}
      knobWidth={23}
    />
  );
};

export default MasterVolume;
