import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FetchVerContentsResp } from '../BackendAPI/interface';
import {
  fetchVerContentsRequest,
  fetchVerContentsSuccess,
  fetchVerContentsFailure,
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
        loadActiveTake(id);
      });
    };
    _();
    return () => {
      trackAPIs.map((trackAPI) => {
        trackAPI.release();
      });
    };
  }, [verId]);
};
