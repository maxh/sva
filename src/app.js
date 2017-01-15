import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducer from './reducers';
import api from './middleware/api';
import { registerScreens } from './screens';
import { initSocket } from './actions/socket'

import { Navigation } from 'react-native-navigation';


// Change this during development to purge the store upon app refresh.
const PURGE = false;

export default class App {

  constructor() {
    const middleware = [thunkMiddleware, api];
    if (__DEV__) {
      middleware.push(createLogger())
    }
    const enhancers = [
      applyMiddleware(...middleware),
      autoRehydrate(),
    ];

    this.store = createStore(reducer, undefined, compose(...enhancers));

    initSocket(this.store);

    // Persist the redux store across app reboots.
    const persist = persistStore(this.store, {storage: AsyncStorage});
    if (PURGE) {
      persist.purge();
    }

    registerScreens(this.store, Provider);

    this.store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    const isSignedIn = Boolean(this.store.getState().auth.user.deviceToken);
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
