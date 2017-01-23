import * as types from '../actions/types';


function ask(state = { transcript: '', answer: '' }, action) {
  switch (action.type) {
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
