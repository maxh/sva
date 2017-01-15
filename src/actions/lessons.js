import { CALL_API } from '../middleware/api';
import * as types from './types';


const loadLessons = () => ({
  [CALL_API]: {
    types: [
      types.LESSONS_REQUEST,
      types.LESSONS_SUCCESS,
      types.LESSONS_FAILURE
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
