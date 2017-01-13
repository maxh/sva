import { Navigation } from 'react-native-navigation';

import LessonsScreen from './LessonsScreen';
import SignInScreen from './SignInScreen';
import AskScreen from './AskScreen';


export function registerScreens(store, Provider) {
  Navigation.registerComponent('LessonsScreen', () => LessonsScreen, store, Provider);
  Navigation.registerComponent('SignInScreen', () => SignInScreen, store, Provider);
  Navigation.registerComponent('AskScreen', () => AskScreen, store, Provider);
}
