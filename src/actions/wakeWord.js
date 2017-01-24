import * as types from './types';
import { USE_WAKEWORD } from '../middleware/wakeWord';

const initializeWakeWord = wakeWord => ({
  [USE_WAKEWORD]: {
    type: types.INITIALIZE_WAKE_WORD,
    word: wakeWord,
  },
});

const sendWakeWordAudio = audio => ({
  [USE_WAKEWORD]: {
    type: types.SEND_WAKE_WORD_AUDIO,
    audioData: audio,
  },
});

const wakeWordListeningStatusChanged = isListening => ({
  type: types.WAKE_WORD_LISTENING_STATUS_CHANGED,
  isListening,
});

export {
  initializeWakeWord,
  sendWakeWordAudio,
  wakeWordListeningStatusChanged,
};
