import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import * as fbApp from 'firebase/app';
import 'firebase/auth';
import Centrifuge from 'centrifuge';

import WebAudioAPI from './AudioAPI/WebAudioAPI';
import BackendAPI from './BackendAPI/Default';
import { setBearerToken } from './BackendAPI/middleware';
import initStore from './store';
import Main from './components/Main';
import Auth from './components/Auth';

const store = initStore();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

const firebase = fbApp.initializeApp({
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
});

const getIdToken = () => {
  return new Promise<string>((resolve, _) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken().then(
          (idToken) => {
            resolve(idToken);
          },
          (err) => {
            resolve('');
          },
        );
      } else {
        resolve('');
      }
    });
  });
};

const handleErr = async (resp: Response) => {
  if (!resp.ok) {
    // Check if idToken appended to Authorization header is valid.
    // If not, jump to login form.
    if (resp.status === 401) {
      window.location.assign('/login');
    }
    const respBody = await resp.text();
    throw new Error(`Non 2xx response: ${resp.status} ${respBody}`);
  }
  return resp;
};

const backendAPI = new BackendAPI(false, 'localhost', 1323);

// HTTP Middleware

backendAPI.beforeRequest(setBearerToken(getIdToken));
backendAPI.afterResponse(handleErr);

const webAudioAPI = new WebAudioAPI(async (src, ac) => {
  const idToken = await getIdToken();
  const resp = await fetch(src, {
    headers: { Authorization: 'Bearer ' + idToken },
  });
  const arrayBuffer = await resp.arrayBuffer();
  return ac.decodeAudioData(arrayBuffer);
});

const centrifuge = new Centrifuge('ws://localhost:8888/connection/websocket');

// Inject dependencies (Delivered by hooks API).
export const backendAPICtx = createContext(backendAPI);
export const webAudioAPICtx = createContext(webAudioAPI);
export const firebaseCtx = createContext(firebase);
export const centrifugeCtx = createContext(centrifuge);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/login">
            <Auth />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
