import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';
import { connect } from 'react-redux';


class LessonsScreen extends Component {
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const datasource = ds.cloneWithRows(this.props.lessons.current)
    return (
      <ListView
        dataSource={datasource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow(value) {
    return (
      <TouchableHighlight>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  lessons: state.lessons
});

const mapDispatchToProps = undefined;

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen);
