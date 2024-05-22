import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFormQuestions } from "../../actions/formAction";
import axios from "axios";
import "./FormPage.css";

const FormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form);
  const { loading, questions, error, spreadsheetId } = formState;

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    dispatch(getFormQuestions(id));
  }, [dispatch, id]);

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted answers:", answers);
    
    const data = [];
    for (let i = 0; i < questions.length; i++) {
      data.push(answers[i] || "");
    }

    try {
      await axios.post("/api/v1/sheet-data", {
        spreadsheetId, 
        data,
      });
      alert("Answers submitted successfully!");

    } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Failed to submit answers. Please try again.");
    }
  };

//to solve render map issue
   const renderQuestions = () => {
     if (!Array.isArray(questions)) {
       return null;
     }

     const elements = [];
     for (let i = 0; i < questions.length; i++) {
       elements.push(
         <div className="form-group" key={i}>
           <label className="label">{questions[i]}</label>
           <input
             type="text"
             value={answers[i] || ""}
             onChange={(e) => handleAnswerChange(i, e.target.value)}
             required
           />
         </div>
       );
     }
     return elements;
   };


  return (
    <div className="form-container">
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {Array.isArray(questions) && questions.length > 0 ? (
        <form onSubmit={handleSubmit}>
          {renderQuestions()}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      ) : (
        !loading && <p>No questions available.</p>
      )}
    </div>
  );
};

export default FormPage;
