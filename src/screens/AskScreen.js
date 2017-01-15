import React, { Component } from 'react'
import {
  Button,
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import { startAudioCapture } from '../actions/capture'


class AskScreen extends Component {
  _startHandler() {
    Speech.speak({
      text: 'Hello there! I am Scout, your voice companion.',
      voice: 'en-US'
    })
    .then(started => {
      console.log('Speech started');
    })
    .catch(error => {
      console.log('You\'ve already started a speech instance.');
    });
  }

  _pauseHandler() {
    Speech.pause();
  }

  _resumeHandler() {
    Speech.resume();
  }

  _stopHandler() {
    Speech.stop();
  }

  componentWillMount() {
    this.props.startAudioCapture();
  }

  render() {
    return (
      <View>
        <Button title="Speak" onPress={this._startHandler}>
        </Button>
        <Button title="Pause" onPress={this._pauseHandler}>
        </Button>
        <Button title="Resume" onPress={this._resumeHandler}>
        </Button>
        <Button title="Stop" onPress={this._stopHandler}>
        </Button>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  lessons: state.lessons
});

const mapDispatchToProps = {
  startAudioCapture: startAudioCapture
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
