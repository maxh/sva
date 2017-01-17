import { NativeModules, NativeEventEmitter } from 'react-native';
import * as types from './types';

const capture = new NativeEventEmitter(NativeModules.MicrophoneCapture);
var SavedDispatch = null;

const statusSubscriber = capture.addListener('recordingStatus', (status) => {
  onRecordingStateChanged(status);
});
const micDataSubscriber = capture.addListener('micData', (data) => {
  onReceivedMicData(data);
});

const onRecordingStateChanged = (isRecording) => {
  if (SavedDispatch) {
    console.log("Recording state changed to " + isRecording);

    SavedDispatch({
      type: types.RECORDING_STATUS_CHANGED,
      isRecording: isRecording,
    });
  }
};

const onReceivedMicData = (params) => {
  if (SavedDispatch) {
    SavedDispatch({
      type: types.MICROPHONE_DATA,
      sampleRate: params.sampleRate,
      data: params.data,
    });
  }
};

const onError = (errorMsg) => {
  console.error("Microphone error: ", errorMsg);
};

const startAudioCapture = () => {
  return (dispatch, getState) => {
    if (getState().microphone.isRequested) {
      throw "Tried to record, but already requesting the microphone!";
      return;
    }
    
    console.log("Starting audio capture!");
    SavedDispatch = dispatch;
    dispatch({
      type: types.RECORDING_REQUESTED,
      isRequested: true,
    });
    NativeModules.MicrophoneCapture.startCapture();
  };
};

const endAudioCapture = () => {
  return (dispatch, getState) => {
    if (!getState().microphone.isRequested) {
      throw "Tried to stop recording, but we're already stopping!";
      return;
    }

    console.log("Ending audio capture!");
    dispatch({
      type: types.RECORDING_REQUESTED,
      isRequested: false,
    });
    NativeModules.MicrophoneCapture.endCapture();
  }
};

export {
  startAudioCapture,
  endAudioCapture,
}
