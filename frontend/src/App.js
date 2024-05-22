import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home/Home.js";
import FormPage from "./component/FormPage/FormPage.js";
import webfontloader from "webfontloader";

function App() {
  useEffect(() => {
    webfontloader.load({
      google: {
        families: ["Times New Roman", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:id" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;

