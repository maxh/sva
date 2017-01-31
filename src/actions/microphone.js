import * as types from './types';
import { USE_MICROPHONE } from '../middleware/microphone';

const startAudioCapture = () => ({
  [USE_MICROPHONE]: {
    type: types.USER_REQUEST_RECORDING,
    shouldRecord: true,
  },
});

export {
  startAudioCapture,
};
