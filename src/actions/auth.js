import { GoogleSignin } from 'react-native-google-signin';

import { CALL_API } from '../middleware/api';
import settings from '../settings';
import { fetchJson } from '../infra/net';
import * as types from './types';


const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

const authLibPromise = GoogleSignin.configure({
  scopes: INITIAL_SCOPES,
  iosClientId: '447160699625-5rv22eleubev18po80835dbk33k190fk.apps.googleusercontent.com',
  webClientId: '447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com',
  offlineAccess: true
});

if (settings.dev.forceGoogleSignOut) {
  GoogleSignin.signOut();
}

const getCurrentUserAsync = () => {
  return authLibPromise.then(() => GoogleSignin.signIn());
}

const ensureGoogleUser = () => {
  return (dispatch, getState) => {
    if (getState().auth.googleUser.current) {
      return Promise.resolve();  // Already signed in.
    }

    dispatch({type: types.GOOGLE_USER_REQUEST});
    return getCurrentUserAsync().then(googleUser => {
      return dispatch({
        type: types.GOOGLE_USER_SUCCESS,
        current: googleUser
      });
    }).catch(error => {
      return dispatch({
        type: types.GOOGLE_USER_FAILURE,
        error: error
      });
    })
  }
};

const ensureDeviceToken = () => {
  return (dispatch, getState) => {
    const googleUser = getState().auth.googleUser.current;
    if (!googleUser) {
      throw Error('There must be googleUser to get a device token.')
    }
    if (getState().auth.deviceToken.current) {
      return Promise.resolve();  // Already have a device token.
    }

    dispatch({type: types.DEVICE_TOKEN_REQUEST});
    const url = settings.urls.mainServer + '/auth/devicetoken';
    // TODO(max): Use real device name.
    const params = {
      googleUser: googleUser,
      deviceName: 'Max Simulator Foo Bar',
      scopes: INITIAL_SCOPES
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin'
    };
    return fetchJson(url, options).then(result => {
      return dispatch({
        type: types.DEVICE_TOKEN_SUCCESS,
        deviceToken: result.deviceToken
      });
    }).catch(error => {
      // TODO(max): Retry a few times.
      return dispatch({type: types.DEVICE_TOKEN_FAILURE, error: error});
    });
  }
};

const signIn = () => {
  return (dispatch, getState) => {
    return dispatch(ensureGoogleUser()).then(() => {
      return dispatch(ensureDeviceToken());
    });
  }
}

export {
  signIn,
}


// Reading list:
// https://github.com/devfd/react-native-google-signin
