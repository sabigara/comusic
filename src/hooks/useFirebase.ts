import { useContext } from 'react';
import { firebaseCtx } from '../App';

export default () => {
  return useContext(firebaseCtx);
};
