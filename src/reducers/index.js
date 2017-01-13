import { combineReducers } from 'redux';

import auth from './auth';
import lessons from './lessons';


export default combineReducers({
  auth,
  lessons
});
