import { GoogleSignin } from 'react-native-google-signin';

const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

GoogleSignin.configure({
  scopes: INITIAL_SCOPES,
  iosClientId: '447160699625-5rv22eleubev18po80835dbk33k190fk.apps.googleusercontent.com',
  webClientId: '447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com',
  offlineAccess: true
})
.then(() => {
  // you can now call currentUserAsync()
});


export const signInGoogleUser = () => {
  return (dispatch, getState) => {
    dispatch({type: 'GOOGLE_USER_REQUEST'});
    return GoogleSignin.currentUserAsync().then(googleUser => {
      dispatch({
        type: 'GOOGLE_USER_SUCCESS',
        value: googleUser
      });
    }).catch(error => {
      dispatch({
        type: 'GOOGLE_USER_FAILURE',
        error: error
      });
    })
  }
};
