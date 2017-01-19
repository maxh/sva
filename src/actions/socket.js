import { USE_SOCKET } from '../middleware/socket';

import * as types from './types';

export const connectSocket = () => ({
  [USE_SOCKET]: {
    type: types.CONNECT_SOCKET,
  },
});

export const sendAudioData = (data) => ({
  [USE_SOCKET]: {
    type: types.SEND_AUDIO_DATA,
    data: data,
  },
});

export const sendSampleRate = (sampleRate) => ({
  [USE_SOCKET]: {
    type: types.SEND_SAMPLE_RATE,
    sampleRate: sampleRate,
  },
});

export const sendEndOfSpeech = () => ({
  [USE_SOCKET]: {
    type: types.SEND_END_OF_SPEECH,
  },
});
