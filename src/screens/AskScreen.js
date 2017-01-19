import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import { startAudioCapture, stopAudioCapture } from '../actions/microphone';
import { connectSocket } from '../actions/socket';

const BLUE = '#007AFF';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  question: {
    fontSize: 50,
    textAlign: 'center',
    margin: 5,
    color: WHITE,
  },
  answer: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 50,
    color: WHITE,
  },
});


class AskScreen extends Component {

  static startHandler() {
    Speech.speak({
      text: 'Hello there! I am Scout, your voice companion.',
      voice: 'en-US',
    })
    .then(started => `Speech started: ${started}`)
    .catch(error => `You've already started a speech instance: ${error}`);
  }

  isRecording() {
    var mic = this.props.microphone;
    return mic.isRecording || mic.isRequested;
  }

  triggerMic() {
    if (this.isRecording()) {
      this.props.stopAudioCapture();
    } else {
      this.props.startAudioCapture();
    }
  }

  componentWillMount() {
    this.props.connectSocket();
  }

  render() {
    var isSocketConnected = this.props.socket.isConnected;
    var recordButtonText = this.isRecording() ? "Stop" : "Ask";
    var transcript = this.props.transcript;
    var answer = this.props.answer;

    var buttonOrConnecting = isSocketConnected ? (
        <Button title={recordButtonText} onPress={() => {this.triggerMic()}}>
        </Button>) : (
        <Text style={styles.question}>Connecting...</Text>
      );

    return (
      <View>
        {buttonOrConnecting}
        <View style={styles.container}>
          <Text style={styles.question}>{transcript}</Text>
          <Text style={styles.answer}>{answer}</Text>
        </View>
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
  ask: state.ask,
  socket: state.socket,
});

const mapDispatchToProps = {
  connectSocket,
  startAudioCapture,
  stopAudioCapture,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
