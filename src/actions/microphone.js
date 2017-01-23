import * as types from './types';
import { USE_MICROPHONE } from '../middleware/microphone';

const startAudioCapture = () => ({
  [USE_MICROPHONE]: {
    type: types.USER_REQUEST_RECORDING,
    shouldRecord: true,
  },
});

const stopAudioCapture = () => ({
  [USE_MICROPHONE]: {
    type: types.USER_REQUEST_RECORDING,
    shouldRecord: false,
  },
});

const serverTerminatedCapture = reason => ({
  [USE_MICROPHONE]: {
    type: types.SERVER_TERMINATED_CAPTURE,
    reason,
  },
});

export {
  startAudioCapture,
  stopAudioCapture,
  serverTerminatedCapture,
};
