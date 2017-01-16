import { GoogleSignin } from 'react-native-google-signin';

import settings from '../settings';
import { fetchJson } from '../infra/net';
import * as types from './types';


const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

const authLibPromise = GoogleSignin.configure({
  scopes: INITIAL_SCOPES,
  iosClientId: '447160699625-5rv22eleubev18po80835dbk33k190fk.apps.googleusercontent.com',
  webClientId: '447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com',
  offlineAccess: true,
});

if (settings.dev.forceGoogleSignOut) {
  GoogleSignin.signOut();
}

const getCurrentUserAsync = () => authLibPromise.then(() => GoogleSignin.signIn());

const ensureGoogleUser = () => (dispatch, getState) => {
  const current = getState().auth.googleUser.current;
  if (current) {
    return Promise.resolve(current);  // Already signed in to Google.
  }

  dispatch({ type: types.GOOGLE_USER_REQUEST });
  return getCurrentUserAsync().then((googleUser) => {
    dispatch({
      type: types.GOOGLE_USER_SUCCESS,
      current: googleUser,
    });
    return googleUser;
  }).catch((error) => {
    dispatch({
      type: types.GOOGLE_USER_FAILURE,
      error,
    });
  });
};

const ensureDeviceToken = (googleUser) => {
  return (dispatch, getState) => {
    if (!googleUser) {
      throw Error('There must be googleUser to get a device token.');
    }
    const current = getState().auth.deviceToken.current;
    if (current) {
      return Promise.resolve();  // Already have a device token.
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
    return fetchJson(url, options).then(result => dispatch({
      type: types.DEVICE_TOKEN_SUCCESS,
      deviceToken: result.deviceToken,
    })).catch(error =>
        // TODO(max): Retry a few times.
         dispatch({ type: types.DEVICE_TOKEN_FAILURE, error }));
  };
};

const signIn = () => {
  return (dispatch, getState) => {
    return dispatch(ensureGoogleUser()).then((googleUser) => {
      return dispatch(ensureDeviceToken(googleUser));
    });
  };
};

export {
  signIn,
};


// Reading list:
// https://github.com/devfd/react-native-google-signin
