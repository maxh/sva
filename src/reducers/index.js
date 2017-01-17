import { combineReducers } from 'redux';

import auth from './auth';
import lessons from './lessons';
import microphone from './microphone';

export default combineReducers({
  auth,
  lessons,
  microphone,
});
