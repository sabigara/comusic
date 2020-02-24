import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ActionTypeName as ATN, createAction } from '../actions';
import { addTakeSuccess, delTakeSuccess } from '../actions/takes';
import { AddTakeResp } from '../BackendAPI/interface';
import { useLoadActiveTake } from './tracks';
import useBackendAPI from './useBackendAPI';
import useAudioAPI from './useAudioAPI';
import { RootState } from '../reducers';

export const useAddTake = () => {
  const dispatch = useDispatch();
  const backendAPI = useBackendAPI();
  const loadActiveTake = useLoadActiveTake();

  return useCallback(
    async (trackId: string, formData: FormData) => {
      let resp: AddTakeResp | undefined = undefined;
      dispatch(createAction(ATN.Take.ADD_TAKE_REQUEST, trackId));
      try {
        resp = await backendAPI.addTake(trackId, formData);
        dispatch(addTakeSuccess(trackId, resp.take, resp.file));
      } catch (err) {
        dispatch(
          createAction(ATN.Take.ADD_TAKE_FAILURE, trackId, err.toString()),
        );
        return;
      }
      loadActiveTake(trackId);
    },
    [loadActiveTake],
  );
};

export const useDelTake = () => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();
  const audioAPI = useAudioAPI();
  const tracks = useSelector((state: RootState) => state.tracks.byId);
  const takes = useSelector((state: RootState) => state.takes.byId);

  return useCallback(
    async (takeId: string) => {
      dispatch(createAction(ATN.Take.DEL_TAKE_REQUEST, takeId));
      try {
        await backendAPI.delTake(takeId);
        dispatch(delTakeSuccess(takeId));
      } catch (err) {
        dispatch(
          createAction(ATN.Take.DEL_TAKE_FAILURE, takeId, err.toString()),
        );
        return;
      }
      const track = tracks[takes[takeId].trackId];
      const trackAPI = audioAPI.getTrack(track.id);
      if (track.activeTake === takeId) {
        trackAPI?.stop();
        trackAPI?.clearBuffer();
      }
    },
    [tracks, takes],
  );
};
