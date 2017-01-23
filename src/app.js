import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { Navigation } from 'react-native-navigation';
import createFilter from 'redux-persist-transform-filter';

import settings from './settings';
import rootReducer from './reducers';
import api from './middleware/api';
import microphone from './middleware/microphone';
import socket from './middleware/socket';
import microphoneToSocket from './middleware/microphone-to-socket';
import { registerScreens } from './screens';

import * as types from './actions/types';

const forAuthOnlyPersistDeviceToken = createFilter(
  'auth', ['deviceToken.current'],
);

export default class App {

  static configureStore() {
    const middlewares = [thunkMiddleware, api, microphone, socket, microphoneToSocket];

    if (__DEV__) {
      middlewares.push(createLogger({
        predicate: (getState, action) => action.type !== types.MICROPHONE_DATA_RECEIVED,
      }));
    }

    return new Promise((resolve, reject) => {
      try {
        const store = createStore(
          rootReducer,
          undefined,
          compose(
            autoRehydrate(),
            applyMiddleware(...middlewares),
          ),
        );

        // The blacklist prevents weird states.
        const options = {
          storage: AsyncStorage,
          blacklist: [
            'microphone',
            'socket',
          ],
          transforms: [forAuthOnlyPersistDeviceToken],
        };
        const persistor = persistStore(store, options, () => {
          resolve(store);
        });
        if (settings.dev.purgeStore) {
          persistor.purge();
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  constructor() {
    App.configureStore().then((store) => {
      this.store = store;
      this.store.subscribe(this.ensureCorrectRootScreen.bind(this));
      registerScreens(this.store, Provider);
      this.ensureCorrectRootScreen();
    });
  }

  ensureCorrectRootScreen() {
    const isSignedIn = Boolean(this.store.getState().auth.deviceToken.current);
    const rootScreen = isSignedIn ? 'after-sign-in' : 'sign-in';
    if (this.currentRootScreen !== rootScreen) {
      this.currentRootScreen = rootScreen;
      App.showRootScreen(rootScreen);
    }
  }

  static showRootScreen(rootScreen) {
    switch (rootScreen) {
      case 'sign-in':
        Navigation.startSingleScreenApp({
          screen: {
            screen: 'SignInScreen',
            navigatorStyle: {},
          },
          passProps: {},
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
            },
          ],
          animationType: 'slide-down',
          title: 'Scout',
          appStyle: {
            bottomTabBadgeTextColor: '#ffffff',
            bottomTabBadgeBackgroundColor: '#ff0000',
          },
        });
        return;
      default:
        throw Error('Unknown app root.');
    }
  }
}
