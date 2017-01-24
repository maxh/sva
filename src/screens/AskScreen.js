import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Speech from 'react-native-speech';
import { connectSocket } from '../actions/socket';

const BLUE = '#007AFF';

const styles = StyleSheet.create({
  question: {
    fontSize: 30,
    textAlign: 'center',
    color: BLUE,
  },
  answer: {
    fontSize: 20,
    textAlign: 'center',
    color: BLUE,
  },
});

const DEBUG_WAKEWORD = () => ({
  type: 'WAKE_WORD_RECEIVED',
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

  componentWillMount() {
    this.props.connectSocket();
  }


  isRecording() {
    const mic = this.props.microphone;
    return mic.isRecording || mic.isRequested;
  }

  triggerMic() {
    this.props.DEBUG_WAKEWORD();
  }

  render() {
    const isSocketConnected = this.props.socket.isConnected;
    const isAsking = this.props.ask.isAsking;

    let stateDisplay;
    if (!isSocketConnected) {
      stateDisplay = (<Text>Connecting</Text>);
    } else if (isAsking) {
      stateDisplay = (<Text>Asking...</Text>);
    } else {
      stateDisplay = (<Text>Waiting for wake word</Text>);
    }

    const transcript = this.props.ask.transcript;
    const answer = this.props.ask.answer;

    return (
      <View>
        {stateDisplay}
        <Text style={styles.question}>{transcript}</Text>
        <Text style={styles.answer}>{answer}</Text>
      </View>
    );
  }
}

AskScreen.propTypes = {
  connectSocket: React.PropTypes.func.isRequired,
  microphone: React.PropTypes.object.isRequired,
  socket: React.PropTypes.object.isRequired,
  ask: React.PropTypes.object.isRequired,
  DEBUG_WAKEWORD: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  microphone: state.microphone,
  ask: state.ask,
  socket: state.socket,
});

const mapDispatchToProps = {
  connectSocket,
  DEBUG_WAKEWORD,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
