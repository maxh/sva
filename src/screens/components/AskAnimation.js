import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';

const ANIMATION_BLUE = '#65a8e2';
const askAnimationStyles = StyleSheet.create({
  circle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: ANIMATION_BLUE,
    opacity: 0.6,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    height: 80,
    width: 80,
  },
});

export default class AskAnimation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationValue: new Animated.Value(0),
    };

    this.animation = null;
    this.setAnimationState(this.props.isAnimating);
  }

  componentWillUpdate(nextProps) {
    if (this.props.isAnimating !== nextProps.isAnimating) {
      this.setAnimationState(nextProps.isAnimating);
    }
  }

  onAnimationComplete(event) {
    if (!event.finished || !this.props.isAnimating) {
      // we were interrupted or aren't supposed to animate
      this.state.animationValue.setValue(0);
      return;
    }

    // re-run the animation
    this.setAnimationState(this.props.isAnimating);
  }

  setAnimationState(willAnimate) {
    if (willAnimate) {
      this.state.animationValue.setValue(0);
      this.animation = Animated.sequence([
        Animated.timing(this.state.animationValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(this.state.animationValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.quad),
        }),
      ]);
      this.animation.start(isFinished => this.onAnimationComplete(isFinished));
    } else if (this.animation) {
      this.animation.stop();
      this.state.animationValue.setValue(0);
    }
  }

  render() {
    const scale1 = this.state.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const scale2 = this.state.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={askAnimationStyles.container}>
          <Animated.View style={[askAnimationStyles.circle, { transform: [{ scale: scale1 }] }]} />
          <Animated.View style={[askAnimationStyles.circle, { transform: [{ scale: scale2 }] }]} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AskAnimation.propTypes = {
  isAnimating: React.PropTypes.bool.isRequired,
  onPress: React.PropTypes.func,
};

AskAnimation.defaultProps = {
  onPress() {},
};

