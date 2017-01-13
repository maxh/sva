import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  NavigationExperimental,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ActionCreators } from '../actions';

import Welcome from './Welcome';
import Lessons from './Lessons';


class AppContainer extends Component {
  render() {
    const scene = this._getScene();
    return (
      <View style={styles.wrapper}>
        {scene}
      </View>
    );
  }

  _getScene() {
    if (!this.props.state.auth.googleUser.current) {
      return <Welcome {...this.props} />;
    } else {
      return <Lessons {...this.props} />;
    }
  }
}

const mapStateToProps = state => {
  return {state: state};
}

const mapDispatchToProps = dispatch => {
  return {actions: bindActionCreators(ActionCreators, dispatch)};
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
