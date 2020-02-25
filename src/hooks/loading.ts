import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers';

// Provide id if want to watch specific loading state.
export const useLoading = (action: string, id?: string): boolean => {
  return useSelector((state: RootState) => {
    if (state.loading[action] === undefined) {
      return false;
    }
    if (id) {
      return state.loading[action].filter((_id) => _id === id).length > 0;
    } else {
      return state.loading[action].length > 0;
    }
  });
};

export const useOnSettled = (
  action: string,
  callback: () => void,
  dep: any[],
) => {
  const state = useSelector((state: RootState) => state.loading[action]);
  dep.push(state, callback);
  useEffect(() => {
    if (state === undefined) return;
    if (state.length > 0) return;
    callback();
  }, dep);
};
