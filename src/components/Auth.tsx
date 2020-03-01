import React from 'react';
import firebaseMod from 'firebase';
import * as firebaseui from 'firebaseui';

import useFirebase from '../hooks/useFirebase';

const Auth: React.FC = () => {
  const firebase = useFirebase();

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function() {
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebaseMod.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod:
          firebaseMod.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>',
  };

  React.useLayoutEffect(() => {
    try {
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#fbauth-container', uiConfig);
    } catch {
      return;
    }
  });
  return <div id="fbauth-container"></div>;
};

export default Auth;
