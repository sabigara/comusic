import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  FetchStudioContentsResp,
  FetchStudiosResp,
} from '../BackendAPI/interface';
import { ActionTypeName as ATP, createAction } from '../actions';
import {
  fetchStudioContentsSuccess,
  fetchStudiosSuccess,
} from '../actions/studios';
import useBackendAPI from './useBackendAPI';

export const useFetchStudioContents = () => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  return useCallback(
    async (studioId: string) => {
      dispatch(
        createAction(ATP.Studio.FETCH_STUDIO_CONTENTS_REQUEST, studioId),
      );
      let resp: FetchStudioContentsResp;
      try {
        resp = await backendAPI.fetchStudioContents(studioId);
        dispatch(
          fetchStudioContentsSuccess(
            studioId,
            resp.songs.byId,
            resp.songs.allIds,
            resp.versions.byId,
            resp.versions.allIds,
          ),
        );
      } catch (err) {
        dispatch(
          createAction(
            ATP.Studio.FETCH_STUDIO_CONTENTS_FAILURE,
            studioId,
            err.toString(),
          ),
        );
        return;
      }
    },
    [backendAPI, dispatch],
  );
};

export const useFetchStudios = (userId?: string) => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();
  const fetchStudioContents = useFetchStudioContents();

  useEffect(() => {
    if (!userId) return;
    const _ = async () => {
      dispatch(createAction(ATP.Studio.FETCH_STUDIOS_REQUEST, ''));
      let resp: FetchStudiosResp;
      try {
        resp = await backendAPI.fetchStudios(userId);
        dispatch(fetchStudiosSuccess(resp.studios.byId, resp.studios.allIds));
      } catch (err) {
        dispatch(
          createAction(ATP.Studio.FETCH_STUDIOS_FAILURE, '', err.toString()),
        );
        return;
      }
      resp.studios.allIds.map((studioId) => {
        fetchStudioContents(studioId);
      });
    };
    _();
  }, [userId, backendAPI, dispatch]);
};
