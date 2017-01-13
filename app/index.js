import React, { Component } from 'react'

import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './reducers';
import api from './middleware/api.js';

import AppContainer from './containers/AppContainer';


// Log Redux activity when in dev mode.
const loggerMiddleware = createLogger(
    {predicate: (getState, action) => __DEV__});

const configureStore = initialState => {
  const enhancer = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
  );
  return createStore(reducer, initialState, enhancer);
}

const initialState = {};
const store = configureStore(initialState);


const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
)

export default App;
