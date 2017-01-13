import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';
import { connect } from 'react-redux';


class AskScreen extends Component {
  render() {
    return (
      <Text>Ask Screen!</Text>
    )
  }
}

const mapStateToProps = state => ({
  lessons: state.lessons
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AskScreen);
