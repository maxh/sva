import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signIn } from '../actions/auth';

const BLUE = '#007AFF';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  title: {
    fontSize: 50,
    textAlign: 'center',
    margin: 5,
    color: WHITE,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 50,
    color: WHITE,
  },
});

export class SignInScreen extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarHidden: true,
  };

  render() {
    let inner;
    if (this.props.isLoading) {
      inner = <Text>Loading...</Text>;
    } else {
      inner = (
        <View>
          <Text style={styles.title}>Scout</Text>
          <Text style={styles.subtitle}>Your voice companion</Text>
          <Icon.Button
            name="google"
            color="#000000"
            backgroundColor="#FFFFFF"
            onPress={this.props.signIn}
          >
            Login with Google
          </Icon.Button>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {inner}
      </View>
    );
  }
}

SignInScreen.propTypes = {
  signIn: React.PropTypes.func.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoading: state.auth.googleUser.isLoading || state.auth.deviceToken.isLoading,
});

const mapDispatchToProps = { signIn };

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
