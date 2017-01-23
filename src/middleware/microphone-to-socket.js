import * as types from '../actions/types';
import { sendAudioData, sendSampleRate, sendEndOfSpeech } from '../actions/socket';
import { serverTerminatedCapture } from '../actions/microphone';

const NOT_YET_SENT = -1;
let sentSampleRate = NOT_YET_SENT;
let isServerReadyForAudio = false;

export default store => next => (action) => {
  switch (action.type) {
    case types.SOCKET_IS_READY_FOR_AUDIO:
      isServerReadyForAudio = true;
      // TODO: flush audio buffer
      break;

    case types.MICROPHONE_DATA_RECEIVED: {
      const socketState = store.getState().socket;

      if (socketState.isConnected) {
        if (sentSampleRate === NOT_YET_SENT) {
          store.dispatch(sendSampleRate(action.sampleRate));
          sentSampleRate = action.sampleRate;
        } else if (action.sampleRate !== sentSampleRate) {
          // sample rate changed mid-recording -- freak out
          throw Error(`Sample rate changed from ${sentSampleRate} to ` +
            `${action.sampleRate} mid-recording`);
        }

        if (isServerReadyForAudio) {
          store.dispatch(sendAudioData(action.data));
        } else {
          // TODO: buffer audio
        }
      }
      break;
    }

    case types.RECORDING_STATUS_CHANGING:
      // if the user pressed stop on the mic, tell the server
      if (!action.willRecord && !action.isFromServer) {
        store.dispatch(sendEndOfSpeech());
      }
      break;

    case types.RECORDING_STATUS_CHANGED: {
      // Whether recording is turned on or off, it's a new recording
      sentSampleRate = NOT_YET_SENT;
      isServerReadyForAudio = false;
      break;
    }

    case types.SOCKET_DISCONNECTED:
      store.dispatch(serverTerminatedCapture('Socket disconnected'));
      break;

    case types.SPEECH_ENDED_BY_SERVER:
      store.dispatch(serverTerminatedCapture('Speech end'));
      break;

    default:
      break;  // Not a mic- or socket-related event.
  }

  next(action);
};
