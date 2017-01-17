import React, { Component } from 'react';
import {
  Button,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import { startAudioCapture, endAudioCapture } from '../actions/microphone';
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

  canRecord() {
    var mic = this.props.microphone;
    var canRecord = !mic.isRecording && !mic.isRequested;
    return canRecord;
  }

  triggerMic() {
    if (this.canRecord()) {
      this.props.startAudioCapture();
    } else {
      this.props.endAudioCapture();
    }
  }

  componentWillMount() {
    this.props.connectSocket();
  }

  render() {
    var recordButtonText = this.canRecord() ? "Ask" : "Stop";

    return (
      <View>
        <Button title={recordButtonText} onPress={() => {this.triggerMic()}}>
        </Button>
      </View>
    );
  }
}

AskScreen.propTypes = {
  connectSocket: React.PropTypes.func.isRequired,
  startAudioCapture: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  microphone: state.microphone,
});

const mapDispatchToProps = {
  connectSocket,
  startAudioCapture,
  endAudioCapture,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
