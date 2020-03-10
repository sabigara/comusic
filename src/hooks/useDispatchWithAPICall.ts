import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { createAction } from '../actions';

export default () => {
  const dispatch = useDispatch();

  return useCallback(
    async (actionName: string, apiCallFn: Function, ...apiCallArgs: any) => {
      const reqId = uuidv4();
      dispatch(createAction(actionName + '_REQUEST', reqId));
      try {
        const resp = await apiCallFn(...apiCallArgs);
        dispatch(createAction(actionName + '_SUCCESS', reqId, resp));
      } catch (err) {
        dispatch(createAction(actionName + '_FAILURE', reqId, err.toString()));
        return;
      }
    },
    [dispatch],
  );
};
