import { combineReducers } from 'redux';

import * as types from '../actions/types';

const mock = [{"_id":"58750d40b79e89001bd72f8f","question":"foo","params":{"answer":"bar"},"function":"constantReply","userId":"58750cf2b79e89001bd72f8e"},{"_id":"58751445b79e89001bd72f92","question":"Set timer for 5 seconds","params":{"time":"5 seconds"},"function":"setTimer","userId":"58750cf2b79e89001bd72f8e"},{"_id":"5875278d490218001b1d1a1d","question":"What time is it in Tokyo?","params":{"city":"Tokyo"},"function":"getTimeInCity","userId":"58750cf2b79e89001bd72f8e"}];

const initialState = {
  isLoading: false,
  current: [],
};

function lessons(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_LESSONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.LOAD_LESSONS_SUCCESS:
      return {
        isLoading: false,
        current: action.response.lessons,
        error: undefined,
      };
    case types.LOAD_LESSONS_FAILURE:
      return {
        isLoading: false,
        current: [],
        error: action.error,
      };
    case types.ADD_LESSON_REQUEST:
      return {
        isLoading: false,
        current: [action.content, ...state.current],
      };
    case types.ADD_LESSON_SUCCESS:
      // Ensure the lesson was added?
    case types.ADD_LESSON_FAILURE:
      // Show the lesson in red?
    default:
      return state;
  }
}

export default lessons;
