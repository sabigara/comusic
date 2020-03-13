import { useEffect } from 'react';

import useBackendAPI from './useBackendAPI';
import useAsyncCallback from './useAsyncCallback';

export const useInvitations = (email?: string) => {
  const backendAPI = useBackendAPI();
  const [callback, value, error, loading] = useAsyncCallback(
    backendAPI.fetchInvitations.bind(backendAPI),
  );

  useEffect(() => {
    if (email === undefined) return;
    callback(email);
  }, []);

  const resp = value
    ? value.invitations.allIds.map((id: string) => value.invitations.byId[id])
    : [];
  return [resp, error, loading];
};
