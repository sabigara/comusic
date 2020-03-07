import { useContext } from 'react';

import { User } from '../common/Domain';
import { firebaseCtx } from '../App';

export const useFirebase = () => {
  return useContext(firebaseCtx);
};

export const useCurrentUser = (): User => {
  const firebase = useFirebase();
  const user = firebase.auth().currentUser;
  if (user === null) {
    // TODO: Define err class and wrap every components
    // with Error Boundary to catch that and log the user out.
    throw Error('Unauthenticated');
  }
  return {
    id: user.uid,
  };
};
