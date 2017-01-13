import { combineReducers } from 'redux';

import * as types from '../actions/types';


function lessons(state = {isLoading: false, current: ['1', '2']}, action) {
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
        current: action.value,
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
