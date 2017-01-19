import settings from '../settings';
import * as types from '../actions/types';
import {connectSocket} from '../actions/socket';
import { getJwt } from '../infra/auth';

let ws = null;

const onMessage = store => (event) => {
  // Parse the JSON message received.
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'SERVER_IS_READY':
      store.dispatch({
        type: types.SOCKET_IS_READY_FOR_AUDIO,
      });
      break;
    case 'SERVER_TRANSCRIPT':
      store.dispatch({
        type: types.TRANSCRIPT_RECEIVED,
        text: message.transcript,
      });
      break;
    case 'SERVER_SPEECH_ENDED':
      store.dispatch({
        type: types.SPEECH_ENDED_BY_SERVER,
      });
      break;
    case 'SERVER_ANSWER':
      store.dispatch({
        type: types.ANSWER_RECEIVED,
        text: message.answer,
      });
      break;
    default:
      throw Error(`Received unknown message type on socket: ${message.type}`);
  }
};

const reconnectAfterDelay = (store) => {
  var socketState = store.getState().socket;
  if (socketState.isConnecting) {
    throw("Asked to reconnect, but already reconnecting");
  }
  if (socketState.isConnected) {
    throw("Asked to reconnect, but already connected");
  }

  var delay = 1000 * Math.pow(1.6, Math.min(socketState.numRetries, 4)) * (Math.random() + 0.5);

  store.dispatch({ type: types.SOCKET_CONNECTING });
  setTimeout(() => store.dispatch(connectSocket()), delay);
};

const onClose = store => () => {
  store.dispatch({ type: types.SOCKET_DISCONNECTED });
  reconnectAfterDelay(store);
};

const connect = (store) => {
  var socketState = store.getState().socket;
  if (socketState.isConnected) {
    throw("Asked to connect, but already connected");
  }

  const deviceToken = store.getState().auth.deviceToken.current;
  if (!deviceToken) {
    throw Error('Device token required to connect socket!');
  }

  store.dispatch({ type: types.SOCKET_CONNECTING });

  getJwt(deviceToken).then((jwt) => {
    const url = `${settings.urls.binaryServer}/?jwt=${jwt}`;
    ws = new WebSocket(url);
    ws.onopen = () => {
      store.dispatch({ type: types.SOCKET_CONNECTED });
    };
    ws.onmessage = onMessage(store);
    ws.onclose = onClose(store);
  }).catch((error) => {
    store.dispatch({
      type: types.SOCKET_ERROR,
      error,
    });
    reconnectAfterDelay(store);
  });
};

const disconnect = (store) => {
  ws.close();
  ws = null;
  return store.dispatch({ type: types.SOCKET_DISCONNECTED });
};

const sendJSONOverSocket = (store, obj) => {
  if (!ws) {
    throw(`Tried to send ${obj} but there was no socket`);
  }
  var socketState = store.getState().socket;
  if (!socketState.isConnected) {
    throw(`Tried to send ${obj} but we're not connected!`);
  }
  ws.send(JSON.stringify(obj));
}

const sendSampleRate = (store, sampleRate) => {
  if (!sampleRate) {
    throw("No sample rate specified");
  }

  sendJSONOverSocket(store, {
    type: 'CLIENT_SAMPLE_RATE',
    sampleRate: sampleRate,
  });
}

const sendAudioData = (store, data) => {
  if (!ws) {
    throw("Tried to send audio data but there was no socket");
  }
  if (!data || !data.length) {
    throw("Asked to send data but it's not an array");
  }
  var socketState = store.getState().socket;
  if (!socketState.isConnected) {
    throw("Tried to send audio but we're not connected!");
  }
  ws.send(new Uint16Array(data));
}

const sendEndOfSpeech = (store) => {
  sendJSONOverSocket(store, {
    type: 'CLIENT_END_OF_SPEECH',
  });
};

export const USE_SOCKET = Symbol('Use Socket');

export default store => next => (action) => {
  const useSocket = action[USE_SOCKET];
  if (typeof useSocket === 'undefined') {
    // Not a socket action, skip.
    next(action);
    return;
  }

  switch (useSocket.type) {
    case types.CONNECT_SOCKET:
      connect(store);
      break;

    case types.DISCONNECT_SOCKET:
      disconnect(store);
      break;

    case types.SEND_SAMPLE_RATE:
      sendSampleRate(store, useSocket.sampleRate);
      break;

    case types.SEND_AUDIO_DATA:
      sendAudioData(store, useSocket.data);
      break;

    case types.SEND_END_OF_SPEECH:
      sendEndOfSpeech(store);
      break;

    default:
      throw Error(`Unexpected use socket action type: ${action.type}`);
  }
};
