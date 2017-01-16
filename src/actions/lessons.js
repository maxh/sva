import { CALL_API } from '../middleware/api';
import * as types from './types';


const loadLessons = () => ({
  [CALL_API]: {
    types: [
      types.LOAD_LESSONS_REQUEST,
      types.LOAD_LESSONS_SUCCESS,
      types.LOAD_LESSONS_FAILURE
    ],
    endpoint: '/lessons',
    method: 'GET'
  }
});

const addLesson = lesson => ({
  [CALL_API]: {
    types: [
      types.ADD_LESSON_REQUEST,
      types.ADD_LESSON_SUCCESS,
      types.ADD_LESSON_FAILURE
    ],
    endpoint: '/lessons',
    method: 'POST',
    content: lesson
  }
});

export {
  loadLessons,
  addLesson
}
