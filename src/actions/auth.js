import { GoogleSignin } from 'react-native-google-signin';

import * as types from '../actions/types';

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

const getCurrentUserAsync = () => {
  return authLibPromise.then(() => GoogleSignin.currentUserAsync())
}

const signInGoogleUser = () => {
  return (dispatch, getState) => {
    dispatch({
      type: types.GOOGLE_USER_REQUEST
    });
    return getCurrentUserAsync().then(googleUser => {
      dispatch({
        type: types.GOOGLE_USER_SUCCESS,
        value: googleUser
      });
    }).catch(error => {
      dispatch({
        type: types.GOOGLE_USER_FAILURE,
        error: error
      });
    })
  }
};


const signInScoutUser = () => {
  return (dispatch, getState) => {
    dispatch({
      type: types.SCOUT_USER_REQUEST
    });
    return getCurrentUserAsync().then(scoutUser => {
      dispatch({
        type: types.SCOUT_USER_SUCCESS,
        value: scoutUser
      });
    }).catch(error => {
      dispatch({
        type: types.SCOUT_USER_FAILURE,
        error: error
      });
    })
  }
};


export const signIn = () => {
  return (dispatch, getState) => {
    return dispatch(signInGoogleUser()).then(() => {
      dispatch(signInScoutUser());
    });
  }
}
