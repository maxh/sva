import { combineReducers } from 'redux';

import * as types from '../actions/types';


function googleUser(state = {isLoading: false}, action) {
  switch (action.type) {
    case types.GOOGLE_USER_REQUEST:
      return {
        isLoading: true,
        value: state.value,
        error: undefined
      };
    case types.GOOGLE_USER_SUCCESS:
      return {
        isLoading: false,
        value: action.value,
        error: undefined
      };
    case types.GOOGLE_USER_FAILURE:
      return {
        isLoading: false,
        value: undefined,
        error: action.error
      };
    default:
      return state;
  }
}

export default combineReducers({
  googleUser,
});
