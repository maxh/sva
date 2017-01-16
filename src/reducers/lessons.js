import * as types from '../actions/types';


const initialState = {
  isLoading: false,
  current: [],
};

function lessons(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_LESSONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.LOAD_LESSONS_SUCCESS:
      return {
        isLoading: false,
        current: action.response.lessons,
        error: undefined,
      };
    case types.LOAD_LESSONS_FAILURE:
      return {
        isLoading: false,
        current: [],
        error: action.error,
      };
    case types.ADD_LESSON_REQUEST:
      return {
        isLoading: false,
        current: [action.content, ...state.current],
      };
    case types.ADD_LESSON_SUCCESS:
      // Ensure the lesson was added?
      return state;
    case types.ADD_LESSON_FAILURE:
      // Show the lesson in red?
      return state;
    default:
      return state;
  }
}

export default lessons;
