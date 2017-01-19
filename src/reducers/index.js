import { combineReducers } from 'redux';

import auth from './auth';
import lessons from './lessons';
import microphone from './microphone';
import ask from './ask';
import socket from './socket';

export default combineReducers({
  ask,
  auth,
  lessons,
  microphone,
  socket,
});
