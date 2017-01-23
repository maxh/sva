import * as types from '../actions/types';


function socket(state = { isConnected: false, numRetries: 0, isConnecting: false }, action) {
  switch (action.type) {
    case types.RECORDING_STATUS_CHANGED:
      return {
        ...state,
      };
    case types.SOCKET_DISCONNECTED:
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
      };
    case types.SOCKET_CONNECTED:
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        numRetries: 0,
      };
    case types.SOCKET_CONNECTING:
      return {
        ...state,
        isConnecting: true,
      };
    case types.SOCKET_ERROR: {
      const numRetries = state.numRetries + 1;
      return {
        ...state,
        numRetries,
        isConnecting: false,
      };
    }
    default:
      return state;
  }
}

export default socket;
