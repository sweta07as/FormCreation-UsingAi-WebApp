const express = require("express");
const {
  generateQuestions,
  createSheetAndGetURL,
  storeQuestionsAndAnswers,
  createForm,
  createFormWithQuestionsAndSheet,
  getFormQuestions,
} = require("../controllers/formController");


const router = express.Router();

// router.route("/generate-questions").post(generateQuestions);
// router.route("/sheet-url").post(createSheetAndGetURL);
// router.route("/form/new").post(createForm);


router.route("/link").post(createFormWithQuestionsAndSheet);

router.route("/sheet-data").post(storeQuestionsAndAnswers);

router.route("/form/:id").get(getFormQuestions);

module.exports = router;
