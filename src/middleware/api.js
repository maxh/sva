import settings from '../settings';

const API_ROOT = settings.urls.mainServer;


const makeApiCall = (options) => {
  const {endpoint, content, method, deviceToken} = options;

  const path = API_ROOT + endpoint;
  const fetchOptions = {
    method: method || 'GET',
    headers: new Headers()
  };

  if (content) {
    fetchOptions.body = JSON.stringify(content);
    fetchOptions.headers.set('Content-Type', 'application/json');
  }

  if (deviceToken) {
    fetchOptions.headers.set(
        'Authorization', 'Scout DeviceToken ' + deviceToken);
  }

  return fetch(path, fetchOptions)
    .then(response => {
      return response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }
        return Object.assign({}, json);
      });
    });
}

export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    // Not an API call action, skip.
    return next(action)
  }

  const { content, method, page, types } = callAPI;

  let { endpoint } = callAPI;
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  if (!endpoint.startsWith('/api')) {
    endpoint = '/api' + endpoint;
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types

  const state = store.getState();

  const deviceToken = state.auth.user.deviceToken;
  if (!deviceToken) {
    console.error('Expected a deviceToken!')
  }

  next(actionWith({
    type: requestType,
    endpoint: endpoint,
    content: content
  }));

  return makeApiCall({endpoint, content, method, deviceToken}).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      page: page,
      error: error.message || 'Unknown server error.'
    }))
  )
};
