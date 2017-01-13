import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';
import { ScrollableTabView } from 'react-native-scrollable-tab-view';


class Lessons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  render() {
    return (
      <ScrollableTabView>
        <ReactPage tabLabel="React" />
        <FlowPage tabLabel="Flow" />
        <JestPage tabLabel="Jest" />
      </ScrollableTabView>
    );
  }

  render1() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const datasource = ds.cloneWithRows(this.props.state.lessons.current)
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

export default Lessons;
