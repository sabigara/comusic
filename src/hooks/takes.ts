import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ActionTypeName as ATN, createAction } from '../actions';
import { addTakeSuccess, delTakeSuccess } from '../actions/takes';
import useBackendAPI from './useBackendAPI';
import useAudioAPI from './useAudioAPI';

export const useAddTake = () => {
  const dispatch = useDispatch();
  const backendAPI = useBackendAPI();
  const audioAPI = useAudioAPI();

  return useCallback(async (trackId: string, formData: FormData) => {
    dispatch(createAction(ATN.Take.ADD_TAKE_REQUEST, trackId));
    try {
      const resp = await backendAPI.addTake(trackId, formData);
      dispatch(addTakeSuccess(trackId, resp.take, resp.file));
    } catch (err) {
      dispatch(
        createAction(ATN.Take.ADD_TAKE_FAILURE, trackId, err.toString()),
      );
    }
  }, []);
};

export const useDelTake = () => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  return useCallback(async (takeId: string) => {
    dispatch(createAction(ATN.Take.DEL_TAKE_REQUEST, takeId));
    try {
      await backendAPI.delTake(takeId);
      dispatch(delTakeSuccess(takeId));
    } catch (err) {
      dispatch(createAction(ATN.Take.DEL_TAKE_FAILURE, takeId, err.toString()));
    }
  }, []);
};
