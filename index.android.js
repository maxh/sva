import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import App from './src/app';


export default class ScoutVoiceApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('ScoutVoiceApp', () => ScoutVoiceApp);
