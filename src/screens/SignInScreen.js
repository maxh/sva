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
import { signIn } from '../actions/auth';


class SignInScreen extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarHidden: true
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scout</Text>
        <Text style={styles.subtitle}>Your voice companion</Text>
        <Icon.Button
            name="google"
            color="#000000"
            backgroundColor="#FFFFFF"
            onPress={this.props.signIn}>
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
  title: {
    fontSize: 50,
    textAlign: 'center',
    margin: 5,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 50,
    color: '#FFFFFF',
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {signIn};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
