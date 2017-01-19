import { GoogleSignin } from 'react-native-google-signin';

import settings from '../settings';
import { fetchJson } from '../infra/net';
import * as types from './types';


const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];


let authLibPromise = null;

const getAuthLibPromise = () => {
  if (!authLibPromise) {
    authLibPromise = GoogleSignin.configure({
      scopes: INITIAL_SCOPES,
      iosClientId: '447160699625-5rv22eleubev18po80835dbk33k190fk.apps.googleusercontent.com',
      webClientId: '447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com',
      offlineAccess: true,
    });

    if (settings.dev.forceGoogleSignOut) {
      GoogleSignin.signOut();
    }
  }
  return authLibPromise;
};

let retryAttempts = 0;
const MAX_ATTEMPTS = 1;

const getGoogleUserAsync = () => getAuthLibPromise().then(() => GoogleSignin.signIn());

const fetchGoogleUser = () => (dispatch, getState) => {
  dispatch({ type: types.GOOGLE_USER_REQUEST });
  return getGoogleUserAsync().then((googleUser) => {
    return dispatch({
      type: types.GOOGLE_USER_SUCCESS,
      current: googleUser,
    });
  }).catch((error) => {
    return dispatch({
      type: types.GOOGLE_USER_FAILURE,
      error,
    });
  });
};

const ensureGoogleUser = () => (dispatch, getState) => {
  const current = getState().auth.googleUser.current;
  if (current) {
    return Promise.resolve();  // Already signed in to Google.
  }
  return dispatch(fetchGoogleUser());
};

const fetchDeviceToken = () => (dispatch, getState) => {
  const googleUser = getState().auth.googleUser.current;
  if (!googleUser) {
    throw Error('There must be googleUser to get a device token.');
  }

  dispatch({ type: types.DEVICE_TOKEN_REQUEST });

  const url = `${settings.urls.mainServer}/auth/devicetoken`;
    // TODO(max): Use real device name.
  const params = {
    googleUser,
    deviceName: 'Max Simulator Foo Bar',
    scopes: INITIAL_SCOPES,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  };

  return fetchJson(url, options).then((result) => {
    return dispatch({
      type: types.DEVICE_TOKEN_SUCCESS,
      deviceToken: result.deviceToken,
    });
  }).catch((error) => {
    if (retryAttempts < MAX_ATTEMPTS) {
      retryAttempts += 1;
      return dispatch(forceFullSignInFlow());  // eslint-disable-line no-use-before-define
    }
    return dispatch({ type: types.DEVICE_TOKEN_FAILURE, error });
  });
};

const ensureDeviceToken = () => (dispatch, getState) => {
  const current = getState().auth.deviceToken.current;
  if (current) {
    return Promise.resolve();  // Already have a device token.
  }
  return dispatch(fetchDeviceToken());
};

const forceFullSignInFlow = () => (dispatch, getState) => {
  GoogleSignin.signOut();
  return dispatch(fetchGoogleUser()).then(() => dispatch(fetchDeviceToken()));
};

const signIn = () => (dispatch, getState) => {
  return dispatch(ensureGoogleUser()).then(() => dispatch(ensureDeviceToken()));
};

export {
  signIn,
};


// Reading list:
// https://github.com/devfd/react-native-google-signin
