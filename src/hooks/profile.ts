import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FetchProfileResp } from '../BackendAPI/interface';
import { ActionTypeName as ATP, createAction } from '../actions';
import { fetchProfileSuccess } from '../actions/profiles';
import useBackendAPI from './useBackendAPI';

export const useFetchProfile = (userId: string) => {
  const backendAPI = useBackendAPI();
  const dispatch = useDispatch();

  useEffect(() => {
    const _ = async () => {
      dispatch(createAction(ATP.Profile.FETCH_PROFILE_REQUEST, userId));
      let resp: FetchProfileResp;
      try {
        resp = await backendAPI.fetchProfile();
        dispatch(fetchProfileSuccess(resp));
      } catch (err) {
        dispatch(
          createAction(
            ATP.Profile.FETCH_PROFILE_FAILURE,
            userId,
            err.toString(),
          ),
        );
        return;
      }
    };
    _();
  }, [userId, backendAPI, dispatch]);
};
