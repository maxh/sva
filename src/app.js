import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { Navigation } from 'react-native-navigation';

import settings from './settings';
import reducer from './reducers';
import api from './middleware/api';
import { registerScreens } from './screens';


export default class App {

  constructor() {
    const middleware = [thunkMiddleware, api];
    if (__DEV__) {
      middleware.push(createLogger());
    }
    const enhancers = [
      applyMiddleware(...middleware),
      autoRehydrate(),
    ];

    this.store = createStore(reducer, undefined, compose(...enhancers));

    // Persist the redux store across app reboots.
    const persist = persistStore(this.store, { storage: AsyncStorage });
    if (settings.dev.purgeStore) {
      persist.purge();
    }

    registerScreens(this.store, Provider);

    this.store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    const isSignedIn = Boolean(this.store.getState().auth.deviceToken.current);
    const rootScreen = isSignedIn ? 'after-sign-in' : 'sign-in';
    if (this.currentRootScreen !== rootScreen) {
      this.currentRootScreen = rootScreen;
      App.startApp(rootScreen);
    }
  }

  static startApp(rootScreen) {
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
