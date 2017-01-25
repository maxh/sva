import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { connectSocket, sendDebugTranscript } from '../actions/socket';
import { AskAnimation } from './components/AskAnimation';

const BLUE = '#007AFF';
const GRAY = 'gray';

const styles = StyleSheet.create({
  infoContainer: {
    marginTop: 32,
  },
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
  debugTextInput: {
    height: 40,
    borderColor: GRAY,
    borderWidth: 1,
  },
  container: {
    alignItems: 'center',
    marginTop: 16,
  },
});

const DEBUG_WAKEWORD = () => ({
  type: 'WAKE_WORD_RECEIVED',
});

class AskScreen extends Component {
  constructor() {
    super();

    this.state = {
      onEnteringText: false,
      manualText: '',
    };
  }

  componentWillMount() {
    this.props.connectSocket();
  }

  onPressedButton = () => {
    this.setState({
      isEnteringText: true,
      manualText: '',
    });
  }

  onSubmitManualText = (event) => {
    this.props.sendDebugTranscript(event.nativeEvent.text);
    this.setState({
      isEnteringText: false,
      manualText: '',
    });
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
    } else if (this.state.isEnteringText) {
      stateDisplay = (<TextInput
        style={styles.debugTextInput}
        onChangeText={text => this.setState({ manualText: text })}
        autoFocus
        value={this.state.manualText}
        onSubmitEditing={this.onSubmitManualText}
      />);
    } else if (isAsking) {
      stateDisplay = (<AskAnimation isAnimating />);
    } else {
      stateDisplay = (
        <AskAnimation isAnimating={false} onPress={this.onPressedButton} />
      );
    }

    const transcript = this.props.ask.transcript;
    const answer = this.props.ask.answer;

    return (
      <View style={styles.container}>
        {stateDisplay}
        <View style={styles.infoContainer}>
          <Text style={styles.question}>{transcript}</Text>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      </View>
    );
  }
}

AskScreen.propTypes = {
  connectSocket: React.PropTypes.func.isRequired,
  sendDebugTranscript: React.PropTypes.func.isRequired,
  socket: React.PropTypes.object.isRequired,
  ask: React.PropTypes.object.isRequired,
  DEBUG_WAKEWORD: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  ask: state.ask,
  socket: state.socket,
});

const mapDispatchToProps = {
  connectSocket,
  DEBUG_WAKEWORD,
  sendDebugTranscript,
};

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
