import { CALL_API } from '../middleware/api';
import * as types from './types';


const fetchLessons = () => ({
  [CALL_API]: {
    types: [ types.LESSONS_REQUEST, types.LESSONS_SUCCESS, types.LESSONS_FAILURE ],
    endpoint: '/lessons/_',
    method: 'GET'
  }
});

export {
  fetchLessons,
}
