import { useSelector } from 'react-redux';

import { RootState } from '../reducers';

export default (action: string, id?: string): boolean => {
  return useSelector((state: RootState) => {
    if (state.loading[action] === undefined) {
      return true;
    }
    if (id) {
      return state.loading[action].filter((_id) => _id === id).length > 0;
    } else {
      return state.loading[action].length > 0;
    }
  });
};
