import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { Navigation } from 'react-native-navigation';

import settings from './settings';
import reducer from './reducers';
import api from './middleware/api';
import { registerScreens } from './screens';
import { initSocket } from './actions/socket';
import { clearGoogleUser } from './actions/auth';


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
    if (settings.dev.purgeStore) {
      persist.purge();
    }

    registerScreens(this.store, Provider);

    this.store.subscribe(this.onStoreUpdate.bind(this));
  }

  initAuth() {
    const googleUser = this.store.getState().auth.googleUser;
    const deviceToken = this.store.getState().auth.deviceToken;
    if (deviceToken.current) {
      if (googleUser.isLoading || googleUser.error) {
        this.store.dispatch(clearGoogleUser());
      }
    }
  }

  onStoreUpdate() {
    const isSignedIn = Boolean(this.store.getState().auth.deviceToken.current);
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
            },
            {
              label: 'Lessons',
              screen: 'LessonsScreen',
              title: 'Lessons',
            }
          ],
          animationType: 'slide-down',
          title: 'Scout',
          appStyle: {
            bottomTabBadgeTextColor: '#ffffff',
            bottomTabBadgeBackgroundColor: '#ff0000'
          }
        });
        return;
      default:
        console.error('Unknown app root.');
    }
  }
}
