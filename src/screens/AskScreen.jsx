import React, { Component } from 'react';
import {
  Button,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import { startAudioCapture } from '../actions/capture';
import { connectSocket } from '../actions/socket';


class AskScreen extends Component {

  static startHandler() {
    Speech.speak({
      text: 'Hello there! I am Scout, your voice companion.',
      voice: 'en-US',
    })
    .then(started => `Speech started: ${started}`)
    .catch(error => `You've already started a speech instance: ${error}`);
  }

  static pauseHandler() {
    Speech.pause();
  }

  static resumeHandler() {
    Speech.resume();
  }

  static stopHandler() {
    Speech.stop();
  }

  componentWillMount() {
    this.props.connectSocket();
    this.props.startAudioCapture();
  }

  render() {
    return (
      <View>
        <Button title="Speak" onPress={AskScreen.startHandler} />
        <Button title="Pause" onPress={AskScreen.pauseHandler} />
        <Button title="Resume" onPress={AskScreen.resumeHandler} />
        <Button title="Stop" onPress={AskScreen.stopHandler} />
      </View>
    );
  }
}

AskScreen.propTypes = {
  connectSocket: React.PropTypes.func.isRequired,
  startAudioCapture: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  connectSocket,
  startAudioCapture,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
