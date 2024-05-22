import "./Home.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFormWithQuestionsAndSheet,
  clearErrors,
} from "../../actions/formAction";
import { Link } from "react-router-dom";
import axios from "axios";


const Home = () => {
  const [topic, setTopic] = useState("");
  const dispatch = useDispatch();

  const formState = useSelector((state) => state.form);
  const { loading, form, error } = formState;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFormWithQuestionsAndSheet(topic));
  };
  
  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="heading">I want to create a form for</div>
        <div className="form-group">
        
          <textarea
            cols="30"
            rows="2"
            type="text"
            className="input-field"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the topic"
            autoComplete="off"
            required
          ></textarea>

        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {error && <p className="error-msg">Error: {error}</p>}
      {form && form.formId && form.googleSpreadsheetURL && (
        <div className="form-group">
          <p>
            Google Spreadsheet URL:{" "}
            <a
              href={form.googleSpreadsheetURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {form.googleSpreadsheetURL}
            </a>
          </p>
          <p>
            Form URL:{" "}
            <Link to={`/form/${form.formId}`}>
              Click here to fill out the form
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
