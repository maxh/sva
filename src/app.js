import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducer from './reducers';
import api from './middleware/api.js';
import { registerScreens } from './screens';

import { Navigation } from 'react-native-navigation';


// Log Redux activity when in dev mode.
const loggerMiddleware = createLogger(
    {predicate: (getState, action) => __DEV__});

const configureStore = () => {
  const enhancers = [
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    autoRehydrate(),
  ];
  return createStore(reducer, undefined, compose(...enhancers));
}

const store = configureStore();
persistStore(store, {storage: AsyncStorage}).purge();
registerScreens(store, Provider);


export default class App {

  constructor() {
    // Since react-redux only works on components, we need to subscribe this class manually.
    store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    // TODO: check for auth.user.
    const isSignedIn = Boolean(store.getState().auth.googleUser.current);
    var rootScreen = isSignedIn ? 'after-sign-in' : 'sign-in';
    if (this.currentRootScreen != rootScreen) {
      this.currentRootScreen = rootScreen;
      this.startApp(rootScreen);
    }
  }

  startApp(rootScreen) {
    switch (rootScreen) {
      case 'sign-in':
        Navigation.startSingleScreenApp({
         screen: {
           screen: 'SignInScreen',
           navigatorStyle: {}
         },
         passProps: {}
        });
        return;
      case 'after-sign-in':
        Navigation.startTabBasedApp({
          tabs: [
            {
              label: 'Ask',
              screen: 'AskScreen',
              title: 'Ask',
              navigatorStyle: {}
            },
            {
              label: 'Train',
              screen: 'LessonsScreen',
              title: 'Train',
              navigatorStyle: {}
            }
          ],
          passProps: {},
          animationType: 'slide-down',
          title: 'Scout',
          appStyle: {
            bottomTabBadgeTextColor: '#ffffff',
            bottomTabBadgeBackgroundColor: '#ff0000'
          }
        });
        return;
      default:
        console.error('Unknown app root');
    }
  }
}
