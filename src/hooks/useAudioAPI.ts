import { useContext } from 'react';
import { webAudioAPICtx } from '../App';
import AudioAPI from '../AudioAPI/interface';

export default (): AudioAPI => {
  return useContext(webAudioAPICtx);
};
