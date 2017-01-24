import { NativeModules, NativeEventEmitter } from 'react-native';
import * as types from '../actions/types';

/* NATIVE HANDLERS */
const wakeWordNative = new NativeEventEmitter(NativeModules.WakeWordDetector);
let SavedDispatch = null;

wakeWordNative.addListener('wakeWordSpoken', () => {
  if (SavedDispatch) {
    SavedDispatch({
      type: types.WAKE_WORD_RECEIVED,
      /*
      confidence: params.confidence,
      word: params.word,
      */
    });
  }
});
wakeWordNative.addListener('error', (msg) => {
  throw new Error(`Wake word error: ${msg}`);
});
wakeWordNative.addListener('ready', (params) => {
  SavedDispatch({
    type: types.WAKE_WORD_DETECTOR_READY,
    params,
  });
});
/* END NATIVE HANDLERS */

const initializeWithWakeWord = (store, wakeWord) => {
  SavedDispatch = store.dispatch;
  NativeModules.WakeWordDetector.initialize(wakeWord, ['sprout', 'snout', 'shout', 'sauerkraut', 'skoul', 'skull', 'owl', 'sprawl']);
};

const sendWakeWordAudio = (store, audioData) => {
  NativeModules.WakeWordDetector.sendMicData(audioData);
};

export const USE_WAKEWORD = Symbol('Wake Word');

export default store => next => (action) => {
  const wakeword = action[USE_WAKEWORD];
  if (typeof wakeword === 'undefined') {
    next(action);
    return;
  }

  switch (wakeword.type) {
    case types.INITIALIZE_WAKE_WORD:
      initializeWithWakeWord(store, wakeword.word);
      break;
    case types.SEND_WAKE_WORD_AUDIO:
      sendWakeWordAudio(store, wakeword.audioData);
      break;
    default:
      throw new Error(`Unexpected wake word action type: ${wakeword.type}`);
  }
};
