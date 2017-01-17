import { combineReducers } from 'redux';

import * as types from '../actions/types';

function microphone(state = {isRecording: false, isRequested: false}, action) {
  switch (action.type) {
    case types.RECORDING_STATUS_CHANGED:
      return {
        ...state,
        isRecording: action.isRecording,
      };
    case types.RECORDING_REQUESTED:
      return {
        ...state,
        isRequested: action.isRequested,
      };
    default:
      return state;
  }
}

export default microphone;
