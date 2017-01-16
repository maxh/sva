// Websocket connection to scout-service.

import settings from '../settings';
import * as types from './types';

import { fetchJson } from '../infra/net';


let _ws = null;

const getJwt = deviceToken => {
  const url = settings.urls.mainServer + '/auth/jwt/fromdevicetoken';
  const options = {
    method: 'POST',
    headers: {'Authorization': 'Scout DeviceToken ' + deviceToken}
  };
  return fetchJson(url, options).then(result => {
    return result.jwt;
  });
};

const connectSocket = () => {
  return (dispatch, getState) => {
    dispatch({type: types.SOCKET_CONNECTING});

    if (_ws) return;

    const deviceToken = getState().auth.deviceToken.current;
    if (!deviceToken) {
      throw Error('Device token required to connect socket!');
    }

    getJwt(deviceToken).then(jwt => {
      const url = settings.urls.binaryServer + '/?jwt=' + jwt;
      _ws = new WebSocket(url);
      _ws.onopen = () => {
        dispatch({
          type: types.SOCKET_CONNECTED
        });
        _ws.send('something'); // send a message
      };
    }).catch(error => {
      dispatch({
        type: types.SOCKET_ERROR,
        error: error
      });
    })
  };
};

export {
  connectSocket,
}