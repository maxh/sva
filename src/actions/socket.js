import { USE_SOCKET } from '../middleware/socket';

import * as types from './types';

export const connectSocket = () => ({
  [USE_SOCKET]: {
    type: types.CONNECT_SOCKET,
  },
});

export const disconnectSocket = () => ({
  [USE_SOCKET]: {
    type: types.DISCONNECT_SOCKET,
  },
});

export const sendAudioData = data => ({
  [USE_SOCKET]: {
    type: types.SEND_AUDIO_DATA,
    data,
  },
});

export const sendSampleRate = sampleRate => ({
  [USE_SOCKET]: {
    type: types.SEND_SAMPLE_RATE,
    sampleRate,
  },
});

export const sendEndOfSpeech = () => ({
  [USE_SOCKET]: {
    type: types.SEND_END_OF_SPEECH,
  },
});

export const sendDebugTranscript = transcript => ({
  [USE_SOCKET]: {
    type: types.SEND_DEBUG_TRANSCRIPT,
    transcript,
  },
});
