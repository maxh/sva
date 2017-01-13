import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';


class SignInScreen extends Component {
  render() {
    // TODO(max): Colored G icon.
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Scout</Text>
        <Icon.Button
            name="google"
            color="#000000"
            backgroundColor="#FFFFFF"
            onPress={this.props.actions.signIn}>
          Login with Google
        </Icon.Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 20,
    color: '#FFFFFF',
  }
});

export default SignInScreen;
