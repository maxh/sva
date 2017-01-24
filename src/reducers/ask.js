import * as types from '../actions/types';

function ask(state = { transcript: '', answer: '', isAsking: false }, action) {
  switch (action.type) {
    case types.WAKE_WORD_LISTENING_STATUS_CHANGED:
      return {
        ...state,
        isAsking: !action.isListening,
      };
    case types.SPEECH_ENDED_BY_SERVER:
      return {
        ...state,
        isAsking: false,
      };
    case types.TRANSCRIPT_RECEIVED:
      return {
        ...state,
        transcript: action.text,
      };
    case types.ANSWER_RECEIVED:
      return {
        ...state,
        answer: action.text,
      };
    default:
      return state;
  }
}

export default ask;
