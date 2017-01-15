import { combineReducers } from 'redux';

import * as types from '../actions/types';


function googleUser(state = {isLoading: false}, action) {
  switch (action.type) {
    case types.GOOGLE_USER_REQUEST:
      return {
        isLoading: true,
        current: state.current,
        error: undefined
      };
    case types.GOOGLE_USER_SUCCESS:
      return {
        isLoading: false,
        current: action.current,
        error: undefined
      };
    case types.GOOGLE_USER_FAILURE:
      return {
        isLoading: false,
        current: undefined,
        error: action.error
      };
    default:
      return state;
  }
}

function user(state = {isLoading: false}, action) {
  switch (action.type) {
    case types.USER_REQUEST:
      return {
        isLoading: true,
        deviceToken: state.deviceToken,
        error: undefined
      };
    case types.USER_SUCCESS:
      return {
        isLoading: false,
        deviceToken: action.deviceToken,
        error: undefined
      };
    case types.USER_FAILURE:
      return {
        isLoading: false,
        deviceToken: undefined,
        error: action.error
      };
    default:
      return state;
  }
}

export default combineReducers({
  googleUser,
  user
});
