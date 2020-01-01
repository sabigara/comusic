import { useContext } from 'react';
import { webAudioAPI } from '../App';
import AudioAPI from '../AudioAPI/interface';

export default (): AudioAPI => {
  return useContext(webAudioAPI);
};
