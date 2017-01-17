import { combineReducers } from 'redux';

import * as types from '../actions/types';


function googleUser(state = {
  isLoading: false,
  current: undefined,
  error: undefined,
}, action) {
  switch (action.type) {
    case types.GOOGLE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.GOOGLE_USER_SUCCESS:
      return {
        isLoading: false,
        current: action.current,
        error: undefined,
      };
    case types.GOOGLE_USER_FAILURE:
      return {
        isLoading: false,
        current: undefined,
        error: action.error,
      };
    default:
      return state;
  }
}

function deviceToken(state = {
  isLoading: false,
  current: undefined,
  error: undefined,
}, action) {
  switch (action.type) {
    case types.DEVICE_TOKEN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.DEVICE_TOKEN_SUCCESS:
      return {
        isLoading: false,
        current: action.deviceToken,
        error: undefined,
      };
    case types.DEVICE_TOKEN_FAILURE:
      return {
        isLoading: false,
        current: undefined,
        error: action.error,
      };
    default:
      return state;
  }
}

export default combineReducers({
  googleUser,
  deviceToken,
});
