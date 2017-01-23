import * as types from '../actions/types';


function microphone(state = { isRecording: false, isRequested: false }, action) {
  switch (action.type) {
    case types.RECORDING_STATUS_CHANGED:
      return {
        ...state,
        isRecording: action.isRecording,
      };
    case types.RECORDING_STATUS_CHANGING:
      return {
        ...state,
        isRequested: action.willRecord,
      };
    default:
      return state;
  }
}

export default microphone;
