import * as types from '../actions/types';

function ask(state = { transcript: '', answer: '', isAsking: false }, action) {
  switch (action.type) {
    case types.WAKE_WORD_RECEIVED:
      return {
        ...state,
        isAsking: true,
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
