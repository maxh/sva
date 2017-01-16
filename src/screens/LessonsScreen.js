import React, { Component } from 'react'
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  ListView
} from 'react-native';
import { connect } from 'react-redux';

import { addLesson, loadLessons } from '../actions/lessons';

const getLessonParams = lesson => {
  const fnName = lesson.fnName;
  let paramSummary = [];
  if (lesson.params) {
    paramSummary = Object.keys(lesson.params).map((p, i) => {
      return p + ": \"" + lesson.params[p] + "\"";
    })
  }
  return fnName + '(' + paramSummary.join(", ") + ')';
}

class LessonsScreen extends Component {
  static navigatorButtons = {
    rightButtons: [{
      title: 'Add new',
      id: 'add-new',
    }],
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (lesson1, lesson2) => lesson1._id !== lesson2._id
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add-new') {
        this.props.addLesson({
          question: 'foo',
          fnName: 'constantReply',
          params: {answer: 'bar'}
        });
      }
    } else if (event.id === 'bottomTabSelected') {
      this.props.loadLessons();
    }
  }

  render() {
    let inner;
    if (this.props.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    } else if (this.props.lessons.length === 0) {
      return (
        <View>
          <Text>Tap "Add new" to create a lesson</Text>
        </View>
      );
    }
    this.dataSource = this.dataSource.cloneWithRows(this.props.lessons);
    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
        />
      </View>
    );
  }

  _renderRow(lesson) {
    return (
      <TouchableHighlight>
        <View>
          <View style={styles.row}>
            <Text style={styles.question}>
              {lesson.question}
            </Text>
            <Text style={styles.detail}>
              {getLessonParams(lesson)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }
}


const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 20
  },
  detail: {
    fontSize: 15
  },
  addNew: {
    fontSize: 20,
    fontStyle: 'italic'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

const mapStateToProps = state => {
  return {
    lessons: state.lessons.current,
    isLoading: state.lessons.isLoading,
  }
}

const mapDispatchToProps = {
  loadLessons,
  addLesson,
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonsScreen);
