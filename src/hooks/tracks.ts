import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ActionTypeName, createAction } from '../actions';
import {
  addTrackSuccess,
  delTrackSuccess,
  updateTrackParam,
} from '../actions/tracks';
import useAudioAPI from './useAudioAPI';
import useBackendAPI from './useBackendAPI';
import { TrackParam } from '../common/Domain';

export const useAddTrack = (verId: string) => {
  const backendAPI = useBackendAPI();
  const audioAPI = useAudioAPI();
  const dispatch = useDispatch();

  return useCallback(async () => {
    dispatch(createAction(ActionTypeName.Track.ADD_TRACK_REQUEST, verId));
    try {
      const resp = await backendAPI.addTrack(verId);
      dispatch(addTrackSuccess(verId, resp));
      const trackAPI = audioAPI.loadTrack(resp.id);
      trackAPI.setVolume(resp.volume);
      trackAPI.setPan(resp.pan);
    } catch (err) {
      dispatch(
        createAction(
          ActionTypeName.Track.ADD_TRACK_FAILURE,
          verId,
          err.toString(),
        ),
      );
    }
  }, [verId]);
};

export const useDelTrack = (trackId: string) => {
  const backendAPI = useBackendAPI();
  const audioAPI = useAudioAPI();
  const dispatch = useDispatch();

  return useCallback(async () => {
    dispatch(createAction(ActionTypeName.Track.DEL_TRACK_REQUEST, trackId));
    try {
      await backendAPI.delTrack(trackId);
      dispatch(delTrackSuccess(trackId));
      audioAPI.getTrack(trackId)?.release();
    } catch (err) {
      dispatch(
        createAction(
          ActionTypeName.Track.DEL_TRACK_FAILURE,
          trackId,
          err.toString(),
        ),
      );
    }
  }, [trackId]);
};

export const useUpdateTrackParam = () => {
  const audioAPI = useAudioAPI();
  const dispatch = useDispatch();

  return useCallback(
    async (trackId: string, param: TrackParam, value: number) => {
      dispatch(updateTrackParam(trackId, param, value));
      const track = audioAPI.getTrack(trackId);
      switch (param) {
        case TrackParam.volume:
          track?.setVolume(value);
          break;
        case TrackParam.pan:
          track?.setPan(value);
          break;
        case TrackParam.pan:
          track?.setPan(value);
          break;
        default:
          break;
      }
    },
    [],
  );
};
