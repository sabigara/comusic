import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { FetchVerContentsResp, AddVersionResp } from '../BackendAPI/interface';
import { createAction, ActionTypeName as ATN } from '../actions';
import {
  fetchVerContentsRequest,
  fetchVerContentsSuccess,
  fetchVerContentsFailure,
  addVersion,
} from '../actions/versions';
import { useLoadActiveTake } from '../hooks/tracks';
import useAudioAPI from './useAudioAPI';
import useBackendAPI from './useBackendAPI';
import { ITrack } from '../AudioAPI/interface';

export const useFetchVerContents = (verId: string) => {
  const backendAPI = useBackendAPI();
  const audioAPI = useAudioAPI();
  const dispatch = useDispatch();
  const loadActiveTake = useLoadActiveTake();

  useEffect(() => {
    if (verId === '') return;
    const trackAPIs: ITrack[] = [];
    const _ = async () => {
      dispatch(fetchVerContentsRequest(verId));
      let resp: FetchVerContentsResp;
      try {
        resp = await backendAPI.fetchVerContents(verId);
        dispatch(
          fetchVerContentsSuccess(
            verId,
            resp.tracks.byId,
            resp.tracks.allIds,
            resp.takes.byId,
            resp.takes.allIds,
            resp.files.byId,
            resp.files.allIds,
          ),
        );
      } catch (err) {
        dispatch(fetchVerContentsFailure(verId, err.toString()));
        return;
      }
      resp.tracks.allIds.map(async (id) => {
        const track = resp.tracks.byId[id];
        const activeTake = resp.takes.byId[track.activeTake];
        const trackAPI = audioAPI.loadTrack(id);
        trackAPIs.push(trackAPI);
        trackAPI.setVolume(track.volume);
        trackAPI.setPan(track.pan);
        if (!activeTake) return;
        loadActiveTake(id, resp.files.byId[activeTake.fileId].url);
      });
    };
    _();
    return () => {
      trackAPIs.map((trackAPI) => trackAPI.release());
    };
  }, [verId, loadActiveTake, audioAPI, backendAPI, dispatch]);
};

export const useAddVersion = () => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  return useCallback(async (songId: string, verName: string) => {
    dispatch(createAction(ATN.Version.ADD_VERSION_REQUEST, songId));
    let versionResp: AddVersionResp;
    try {
      versionResp = await backendAPI.addVersion(songId, verName);
    } catch (err) {
      dispatch(
        createAction(ATN.Version.ADD_VERSION_FAILURE, songId, err.toString()),
      );
      return;
    }
    dispatch(addVersion(songId, versionResp));
  }, []);
};

export const useDelVersion = () => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  return useCallback(async (verId: string) => {
    dispatch(createAction(ATN.Version.DEL_VERSION_REQUEST, verId));
    try {
      await backendAPI.delVersion(verId);
    } catch (err) {
      dispatch(
        createAction(ATN.Version.DEL_VERSION_FAILURE, verId, err.toString()),
      );
      return;
    }
    dispatch(createAction(ATN.Version.DEL_VERSION_SUCCESS, verId));
  }, []);
};
