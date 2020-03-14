import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useBackendAPI from './useBackendAPI';
import { fetchInvitations } from '../actions/invitations';
import { RootState } from '../reducers';
import useAsyncCallback from './useAsyncCallback';

export const useFetchInvitations = () => {
  const dispatch = useDispatch();
  const backendAPI = useBackendAPI();
  const items = useSelector((state: RootState) =>
    state.invitations.allIds.map((id) => state.invitations.byId[id]),
  );
  const {
    callback,
    loading,
  } = useAsyncCallback(backendAPI.fetchInvitations.bind(backendAPI), (resp) =>
    dispatch(fetchInvitations(resp.invitations)),
  );

  return { callback, items, loading };
};
