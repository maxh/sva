import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  WebView,
} from 'react-native';
import { connect } from 'react-redux';
import { connectSocket, sendDebugTranscript } from '../actions/socket';
import AskAnimation from './components/AskAnimation';


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
  webview: {
    marginTop: 20,
    height: 400,
    width: 800,
  },
});

const DEBUG_WAKEWORD = () => ({
  type: 'WAKE_WORD_RECEIVED',
});

class AskScreen extends Component {
  constructor() {
    super();
    this.onPressedButton = this.onPressedButton.bind(this);
    this.onSubmitManualText = this.onSubmitManualText.bind(this);
    this.state = {
      onEnteringText: false,
      manualText: '',
      fetchedHtml: '',
    };
  }

  componentWillMount() {
    this.props.connectSocket();
  }

  componentWillReceiveProps(nextProps) {
    const { htmlRequest } = nextProps.ask.answer;
    if (!htmlRequest) {
      this.setState({ fetchedHtml: '' });
    } else if (htmlRequest !== this.props.ask.answer.htmlRequest) {
      this.fetchHtml(htmlRequest);
    }
  }

  onPressedButton() {
    this.setState({
      isEnteringText: true,
      manualText: '',
    });
  }

  onSubmitManualText(event) {
    this.props.sendDebugTranscript(event.nativeEvent.text);
    this.setState({
      isEnteringText: false,
      manualText: '',
    });
  }

  triggerMic() {
    this.props.DEBUG_WAKEWORD();
  }

  fetchHtml(request) {
    fetch(request.url, request.options).then((response) => {
      response.text().then((html) => {
        if (this.props.ask.answer.htmlRequest !== request) {
          return;  // The html request answer is no longer relevant.
        }
        this.setState({ fetchedHtml: html });
      });
    });
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
    const { link, display, htmlRequest } = this.props.ask.answer;

    let source;  // For webview.
    let text;    // For normal text display.
    if (link) {
      source = { uri: link };
    } else if (this.state.fetchedHtml) {
      source = { html: this.state.fetchedHtml };
    } else if (display) {
      text = display;
    } else if (htmlRequest) {
      text = 'Loading...';
    }

    return (
      <View style={styles.container}>
        {stateDisplay}
        <View style={styles.infoContainer}>
          <Text style={styles.question}>{transcript || 'Say "Scout" to wake me up!'}</Text>
          { source &&
            <WebView
              source={source}
              style={styles.webview}
            />
          }
          { text &&
            <Text style={styles.answer}>{text}</Text>
          }
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
