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

import AppContainer from './containers/AppContainer';


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
persistStore(store, {storage: AsyncStorage}, () => {
  console.log('restored')
})

const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
)

export default App;

//Screen related book keeping.
registerScreens(store, Provider);


// Notice that this is just a simple class, it's not a React component.
export default class App {

  constructor() {
    // Since react-redux only works on components, we need to subscribe this class manually.
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(appActions.appInitialized());
  }

  onStoreUpdate() {
    const { root } = store.getState().app;
    if (this.currentRoot != root) {
      this.currentRoot = root;
      this.startApp(root);
    }
  }

  startApp(root) {
    switch (root) {
      case 'sign-in':
        if (Platform.OS === 'ios') {
          Navigation.startSingleScreenApp({
           screen: {
             screen: 'example.LoginScreen',
             title: 'Login',
             navigatorStyle: {}
           },
           passProps: {}
          });
        }
        return;
      case 'after-sign-in':
        Navigation.startTabBasedApp({
          tabs: [
            {
              label: 'One',
              screen: 'example.FirstTabScreen',
              icon: require('../img/one.png'),
              selectedIcon: require('../img/one_selected.png'),
              title: 'Screen One',
              overrideBackPress: true,
              navigatorStyle: {}
            },
            {
              label: 'Two',
              screen: 'example.SecondTabScreen',
              icon: require('../img/two.png'),
              selectedIcon: require('../img/two_selected.png'),
              title: 'Screen Two',
              navigatorStyle: {}
            }
          ],
          passProps: {},
          animationType: 'slide-down',
          title: 'Redux Example',
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
