import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView,
} from 'react-native';
import { connect } from 'react-redux';

import { addLesson, loadLessons } from '../actions/lessons';

const getLessonParams = (lesson) => {
  const fnName = lesson.fnName;
  let paramSummary = [];
  if (lesson.params) {
    paramSummary = Object.keys(lesson.params).map(p => `${p}: "${lesson.params[p]}"`);
  }
  return `${fnName}(${paramSummary.join(', ')})`;
};

const LIGHT_GRAY = '#F6F6F6';
const DARK_GRAY = '#8E8E8E';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: LIGHT_GRAY,
  },
  utterance: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  detail: {
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: DARK_GRAY,
  },
});

class LessonsScreen extends Component {
  static navigatorButtons = {
    rightButtons: [{
      title: 'Add new',
      id: 'add-new',
    }],
  };

  static renderRow(lesson) {
    return (
      <TouchableHighlight>
        <View>
          <View style={styles.row}>
            <Text style={styles.utterance}>
              {lesson.utterance}
            </Text>
            <Text style={styles.detail}>
              {getLessonParams(lesson)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  static renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (lesson1, lesson2) => lesson1.id !== lesson2.id,
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add-new') {
        this.props.addLesson({
          utterance: 'foo',
          fnName: 'constantReply',
          params: { answer: 'bar' },
        });
      }
    } else if (event.id === 'bottomTabSelected') {
      this.props.loadLessons();
    }
  }

  render() {
    if (this.props.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    } else if (this.props.error) {
      return (
        <View>
          <Text>Error.</Text>
        </View>
      );
    } else if (this.props.lessons.length === 0) {
      return (
        <View>
          <Text>{'Tap "Add new" to create a lesson'}</Text>
        </View>
      );
    }
    this.dataSource = this.dataSource.cloneWithRows(this.props.lessons);
    return (
      <View>
        <ListView
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={LessonsScreen.renderRow}
          renderSeparator={LessonsScreen.renderSeparator}
        />
      </View>
    );
  }
}

LessonsScreen.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  lessons: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  addLesson: React.PropTypes.func.isRequired,
  loadLessons: React.PropTypes.func.isRequired,
  error: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lessons: state.lessons.current,
  isLoading: state.lessons.isLoading,
  error: state.lessons.error || '',
});

const mapDispatchToProps = {
  loadLessons,
  addLesson,
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen);
