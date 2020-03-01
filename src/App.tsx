import React, { createContext, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import * as fbApp from 'firebase/app';
import 'firebase/auth';

import WebAudioAPI from './AudioAPI/WebAudioAPI';
import BackendAPI from './BackendAPI/Default';
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
  return new Promise((resolve, _) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken().then(
          (idToken) => {
            resolve(idToken);
          },
          (err) => {
            resolve(null);
          },
        );
      } else {
        resolve(null);
      }
    });
  });
};

const backendAPI = new BackendAPI();

// HTTP Middleware

// Retrieved user's credential from firebase, and append it to Authorization header.
// Even if an error occurs while getting token, ignore it and send empty string.
// It will just return 401 so `after middleware` logs the user out.
backendAPI.before(async (req) => {
  const idToken = await getIdToken();
  const headers = new Headers();
  Object.entries(req.headers).map(([key, val]) => {
    headers.append(key, val);
  });
  headers.append('Authorization', 'Bearer ' + idToken);
  const newReq = new Request(req.url, {
    method: req.method,
    headers: headers,
    mode: req.mode,
    credentials: req.credentials,
    cache: req.cache,
    redirect: req.redirect,
    referrer: req.referrer,
    body: req.body,
  });
  return newReq;
});

// Error handler.
backendAPI.after(async (resp) => {
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
});

// Read response as json.
backendAPI.after(async (resp) => {
  if (resp.headers.get('Content-Type')?.split(';')[0] === 'application/json') {
    return resp.json();
  }
});

// Inject dependencies (Delivered by hooks API).
export const webAudioAPICtx = createContext(new WebAudioAPI());
export const backendAPICtx = createContext(backendAPI);
export const firebaseCtx = createContext(firebase);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/login">
            <Auth />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
