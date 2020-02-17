import { useContext } from 'react';
import { backendAPICtx } from '../App';
import BackendAPI from '../BackendAPI/interface';

export default (): BackendAPI => {
  return useContext(backendAPICtx);
};
