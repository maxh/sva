import { GoogleSignin } from 'react-native-google-signin';
import { CALL_API } from '../middleware/api';
import settings from '../settings';

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
  return authLibPromise.then(() => GoogleSignin.signIn())
}

const signInGoogleUser = () => {
  return (dispatch, getState) => {
    dispatch({
      type: types.GOOGLE_USER_REQUEST
    });
    return getCurrentUserAsync().then(googleUser => {
      dispatch({
        type: types.GOOGLE_USER_SUCCESS,
        current: googleUser
      });
    }).catch(error => {
      dispatch({
        type: types.GOOGLE_USER_FAILURE,
        error: error
      });
    })
  }
};

const signInScoutUser = googleUser => {
  return (dispatch, getState) => {
    dispatch({type: types.DEVICE_TOKEN_REQUEST});
    const path = settings.urls.mainServer + '/auth/devicetoken';
    // TODO(max): Use real device name, let scopes be different for upgrading.
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
    return fetch(path, options).then(response => {
      if (!response.ok) throw Error(resonse.statusText);
      return response.json().then(json => {
        return dispatch({
          type: types.DEVICE_TOKEN_SUCCESS,
          deviceToken: json.deviceToken
        });
      });
    }).catch(error => {
      return dispatch({type: types.DEVICE_TOKEN_FAILURE, error: error});
    });
  }
};

const clearGoogleUser = () => ({
  type: types.GOOGLE_USER_REQUEST
});

const signIn = () => {
  return (dispatch, getState) => {
    return dispatch(signInGoogleUser()).then(() => {
      const currentGoogleUser = getState().auth.googleUser.current;
      if (currentGoogleUser) {
        return dispatch(signInScoutUser(currentGoogleUser));
      } else {
        return dispatch({
          type: types.GOOGLE_USER_FAILURE,
          error: 'Expected a Google user but there was none.'
        });
      }
    });
  }
}

export {
  clearGoogleUser,
  signIn,
}
