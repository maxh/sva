import * as types from '../actions/types';
import { disconnectSocket, sendAudioData, sendSampleRate } from '../actions/socket';
import { startAudioCapture } from '../actions/microphone';
import { sendWakeWordAudio, wakeWordListeningStatusChanged } from '../actions/wakeWord';

const NOT_YET_RECEIVED = -1;
let lastSampleRate = NOT_YET_RECEIVED;

const INITIALIZING = 0;
const LISTENING_FOR_WAKE_WORD = 1;
const WAITING_FOR_SERVER_READY = 2;
const SENDING_TO_SERVER = 3;
let state = INITIALIZING;

const MAX_AUDIO_BUFFER_LENGTH = 10;
const audioSampleBuffer = [];

let currentStreamNum = 0;
const STREAM_TIMEOUT_MS = 10000;

export default store => next => (action) => {
  switch (action.type) {
    case types.WAKE_WORD_DETECTOR_READY:
      if (state !== INITIALIZING) {
        throw new Error(`Wake word detector ready while we're in state ${state}`);
      }

      state = LISTENING_FOR_WAKE_WORD;
      if (action.params.bitsPerSample !== 16 || action.params.numChannels !== 1) {
        throw new Error(`Unsupported format in wake word detector: ${action.params}`);
      }
      store.dispatch(startAudioCapture());
      break;

    case types.WAKE_WORD_RECEIVED: {
      if (state !== LISTENING_FOR_WAKE_WORD) {
        throw new Error(`Got a wake word notification but we're in state ${state}`);
      }
      state = WAITING_FOR_SERVER_READY;
      store.dispatch(wakeWordListeningStatusChanged(false));

      if (lastSampleRate === NOT_YET_RECEIVED) {
        throw new Error('Got the wake word but haven\'t seen the sample rate');
      }
      store.dispatch(sendSampleRate(lastSampleRate));

      const dispatchedStreamNum = currentStreamNum;
      setTimeout(() => {
        // if we're still on this stream, cancel it
        if (currentStreamNum === dispatchedStreamNum) {
          console.log('Stream timeout -- disconnecting!');
          store.dispatch(disconnectSocket());
        }
      }, STREAM_TIMEOUT_MS);
      break;
    }

    case types.SOCKET_IS_READY_FOR_AUDIO:
      if (state !== WAITING_FOR_SERVER_READY) {
        throw new Error(`Got a socket ready message but we're in state ${state}`);
      }
      state = SENDING_TO_SERVER;
      while (audioSampleBuffer.length > 0) {
        store.dispatch(sendAudioData(audioSampleBuffer.shift()));
      }
      break;

    case types.MICROPHONE_DATA_RECEIVED:
      if (lastSampleRate !== action.sampleRate) {
        console.log(`Setting the sample rate to ${action.sampleRate}`);
        lastSampleRate = action.sampleRate;
      }

      if (state === LISTENING_FOR_WAKE_WORD) {
        store.dispatch(sendWakeWordAudio(action.data));
      } else if (state === SENDING_TO_SERVER) {
        store.dispatch(sendAudioData(action.data));
      } else if (state === WAITING_FOR_SERVER_READY) {
        if (audioSampleBuffer.length > MAX_AUDIO_BUFFER_LENGTH) {
          audioSampleBuffer.shift();
        }
        audioSampleBuffer.push(action.data);
      }
      break;

    case types.RECORDING_STATUS_CHANGING:
      /*
      // if the user pressed stop on the mic, tell the server
      if (!action.willRecord && !action.isFromServer) {
        store.dispatch(sendEndOfSpeech());
      }
      */
      break;

    case types.SOCKET_DISCONNECTED:
    case types.SPEECH_ENDED_BY_SERVER:
    case types.SPEECH_REQUEST_TIMED_OUT:
      if (state === WAITING_FOR_SERVER_READY ||
          state === SENDING_TO_SERVER
      ) {
        currentStreamNum += 1;
        state = LISTENING_FOR_WAKE_WORD;
        store.dispatch(wakeWordListeningStatusChanged(true));
      }
      break;

    default:
      break;
  }

  next(action);
};
