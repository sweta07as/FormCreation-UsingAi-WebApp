import {
  CREATE_FORM_REQUEST,
  CREATE_FORM_SUCCESS,
  CREATE_FORM_FAIL,
  GET_FORM_QUESTIONS_REQUEST,
  GET_FORM_QUESTIONS_SUCCESS,
  GET_FORM_QUESTIONS_FAIL,
  CLEAR_ERRORS,
} from "../constants/formConstants";

const formReducer = (
  state = { form: {}, questions: [], spreadsheetId: "" },
  action
) => {
  switch (action.type) {
    case CREATE_FORM_REQUEST:
    case GET_FORM_QUESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_FORM_SUCCESS:
      return {
        ...state,
        loading: false,
        form: action.payload,
      };
    case GET_FORM_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        questions: action.payload.questions,
        spreadsheetId: action.payload.spreadsheetId,
      };
    case CREATE_FORM_FAIL:
    case GET_FORM_QUESTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default formReducer;
