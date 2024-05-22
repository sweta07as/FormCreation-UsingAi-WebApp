import {
  CREATE_FORM_REQUEST,
  CREATE_FORM_SUCCESS,
  CREATE_FORM_FAIL,
  GET_FORM_QUESTIONS_REQUEST,
  GET_FORM_QUESTIONS_SUCCESS,
  GET_FORM_QUESTIONS_FAIL,
  CLEAR_ERRORS,
} from "../constants/formConstants";

import axios from "axios";

export const createFormWithQuestionsAndSheet = (topic) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_FORM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/v1/link", { topic }, config);

    dispatch({
      type: CREATE_FORM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_FORM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getFormQuestions = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_FORM_QUESTIONS_REQUEST });

    const { data } = await axios.get(`/api/v1/form/${id}`);

    const spreadsheetId = data.googleSpreadsheetURL.split("/")[5]; // Extract the spreadsheetId from the URL

    dispatch({
      type: GET_FORM_QUESTIONS_SUCCESS,
      payload: { questions: data.questions, spreadsheetId },
    });
  } catch (error) {
    dispatch({
      type: GET_FORM_QUESTIONS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


//Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
