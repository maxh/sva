import * as types from '../actions/types';
import { NativeModules, NativeEventEmitter } from 'react-native';

/* NATIVE HANDLERS */
const capture = new NativeEventEmitter(NativeModules.MicrophoneCapture);
let SavedDispatch = null;
const statusSubscriber = capture.addListener('recordingStatus', (status) => {
  if (SavedDispatch) {
    SavedDispatch({
      type: types.RECORDING_STATUS_CHANGED,
      isRecording: status,
    });
  }
});
const micDataSubscriber = capture.addListener('micData', (params) => {
  if (SavedDispatch) {
    SavedDispatch({
      type: types.MICROPHONE_DATA_RECEIVED,
      sampleRate: params.sampleRate,
      data: params.data,
    });
  }
});
const errorSubscriber = capture.addListener('error', (msg) => {
  throw("Microphone error: " + msg);
});
/* END NATIVE HANDLERS */

const setAudioCapture = (store, shouldCapture, isFromServer) => {
  if (shouldCapture == store.getState().microphone.isRequested) {
    if (!isFromServer) {
      // it's ok if the server tells us to start or stop and we're
      // already in that state -- but it's not ok if it's initiated by
      // the client and we're already in that state
      throw("Tried to set audio capture to " + shouldCapture +
        " but it's already " + store.getState().microphone.isRequested);
    }
    return;
  }

  SavedDispatch = store.dispatch;
  store.dispatch({
    type: types.RECORDING_STATUS_CHANGING,
    willRecord: shouldCapture,
    isFromServer: isFromServer,
  });

  if (shouldCapture) {
    NativeModules.MicrophoneCapture.startCapture();
  } else {
    NativeModules.MicrophoneCapture.stopCapture();
  }
};

export const USE_MICROPHONE = Symbol('Microphone');

export default store => next => (action) => {
  const microphone = action[USE_MICROPHONE];
  if (typeof microphone === 'undefined') {
    next(action);
    return;
  }

  switch (microphone.type) {
    case types.USER_REQUEST_RECORDING:
      setAudioCapture(store, microphone.shouldRecord, false /*isFromServer*/);
      break;
    case types.SERVER_TERMINATED_CAPTURE:
      setAudioCapture(store, false /*shouldCapture*/, true /*isFromServer*/);
      break;
    default:
      throw Error(`Unexpected microphone action type: ${microphone.type}`);
  }
};
