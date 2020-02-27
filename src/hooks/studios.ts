import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FetchStudioContentsResp } from '../BackendAPI/interface';
import { ActionTypeName as ATP, createAction } from '../actions';
import { fetchStudioContentsSuccess } from '../actions/studios';
import useBackendAPI from './useBackendAPI';

export const useFetchStudioContents = (studioId: string) => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  useEffect(() => {
    const _ = async () => {
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
    };
    _();
  }, [studioId, backendAPI, dispatch]);
};
