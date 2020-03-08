import { useContext } from 'react';

import { User } from '../common/Domain';
import { firebaseCtx } from '../App';

export const useFirebase = () => {
  return useContext(firebaseCtx);
};

export const useCurrentUser = (): User | null => {
  const firebase = useFirebase();
  const user = firebase.auth().currentUser;
  if (user === null) {
    return null;
  }
  return {
    id: user.uid,
    email: user.email ? user.email : '',
  };
};
