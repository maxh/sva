import { combineReducers } from 'redux';

import * as types from '../actions/types';

const mock = [{"_id":"58750d40b79e89001bd72f8f","question":"foo","params":{"answer":"bar"},"function":"constantReply","userId":"58750cf2b79e89001bd72f8e"},{"_id":"58751445b79e89001bd72f92","question":"Set timer for 5 seconds","params":{"time":"5 seconds"},"function":"setTimer","userId":"58750cf2b79e89001bd72f8e"},{"_id":"5875278d490218001b1d1a1d","question":"What time is it in Tokyo?","params":{"city":"Tokyo"},"function":"getTimeInCity","userId":"58750cf2b79e89001bd72f8e"}];

function lessons(state = {isLoading: false}, action) {
  switch (action.type) {
    case types.LESSONS_REQUEST:
      return {
        isLoading: true,
        current: state.current,
        error: undefined
      };
    case types.LESSONS_SUCCESS:
      return {
        isLoading: false,
        current: action.lessons,
        error: undefined
      };
    case types.LESSONS_FAILURE:
      return {
        isLoading: false,
        current: undefined,
        error: action.error
      };
    default:
      return state;
  }
}

export default lessons;
