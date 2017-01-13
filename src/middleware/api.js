const API_ROOT = 'http://localhost:4000';

const makeApiCall = (options) => {
  const {endpoint, content, method, } = options;

  const path = API_ROOT + endpoint;
  const fetchOptions = {
    method: method || 'GET',
    headers: new Headers()
  };

  if (tokenId) {
    fetchOptions.headers.set(AUTH_TOKEN_HEADER, tokenId);
  }

  if (linkCode) {
    fetchOptions.headers.set(LINK_CODE_HEADER, linkCode);
  }

  if (content) {
    fetchOptions.body = JSON.stringify(content);
    fetchOptions.headers.set('Content-Type', 'application/json');
  }

  return fetch(path, fetchOptions)
    .then(response => {
      const cookie = response.headers.get('set-cookie');
      let sessionCookie = cookie.indexOf('session=') === 0 ? cookie : null;
      return response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }
        return Object.assign({}, json, { _sessionCookie: sessionCookie });
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

  const { endpoint, content, method, page, types } = callAPI

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

  const currentGoogleUser = state.googleUser.current;
  const tokenId = currentGoogleUser && currentGoogleUser.tokenId;

  next(actionWith({ type: requestType, endpoint: endpoint }))

  return makeApiCall({endpoint, content, method, tokenId, linkCode}).then(
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
