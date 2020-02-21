import { useSelector } from 'react-redux';

import { RootState } from '../reducers';

export const useTakes = (trackId: string) => {
  return useSelector((state: RootState) => {
    return state.takes.allIds
      .map((id) => state.takes.byId[id])
      .filter((take) => take.trackId === trackId);
  });
};

export const useActiveTakeId = (trackId: string) => {
  return useSelector((state: RootState) => {
    return state.tracks.byId[trackId].activeTake;
  });
};
