const apiToken = process.env.LLAMAAI_API_KEY;
const axios = require("axios");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

const Form = require("../models/formModel");

const generateQuestions = async (topic) => {

  try {
    const response = await axios({
      method: "POST",
      url: "https://api.llama-api.com/chat/completions",
      headers: {
        Authorization:
          `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "llama-13b-chat",
        messages: [
          {
            role: "system",
            content: `PROVIDE form questions for ${topic} in an ARRAY OF STRING FORMAT with NO extra words or explanations`,
          },
        ],
      },
    });

    const content = response.data.choices[0].message.content;
    const questions = JSON.parse(content);
    return questions;

  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Error generating questions");
  }
};

const createSheetAndGetURL = async () => {
  try {
    const response = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: "Form Data",
        },
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    const sheetURL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    await drive.permissions.create({
      fileId: spreadsheetId,
      resource: {
        role: "writer", // or 'reader' if you want to give read access only
        type: "anyone",
      },
    });

    return sheetURL;

  } catch (error) {
    console.error("Error creating the spreadsheet:", error);
    throw new Error("Error creating the spreadsheet");
  }
};


const storeQuestions = async (spreadsheetId, data) => {

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!1:1",
    });

    const existingData = response.data.values ? response.data.values[0] : [];
    const nextAvailableColumn = existingData.length + 1;
    const columnLetter = String.fromCharCode(64 + nextAvailableColumn);

    const formattedData = data.map((question) => [question]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!${columnLetter}1`,
      valueInputOption: "RAW",
      resource: {
        values: formattedData,
      },
    });

    console.log("Data successfully stored in the spreadsheet.");

    return;

  } catch (error) {
    console.error("Error updating the spreadsheet:", error);
    throw new Error("Error updating the spreadsheet");
  }
};

exports.createFormWithQuestionsAndSheet = async (req, res) => {
  const { topic } = req.body;

  try {
    // Step 1: Generate Questions
    const questions = await generateQuestions(topic);
    

    // Step 2: Create Google Sheet and Get URL
    const sheetURL = await createSheetAndGetURL();

    // Step 3: Create Form and Save to Database
    const form = await Form.create({
      topic,
      questions,
      googleSpreadsheetURL: sheetURL,
    });

    const spreadsheetId = sheetURL.split("/")[5];

    // Step 4: Store Questions to the Google Sheet
    await storeQuestions(spreadsheetId, questions);

    console.log(form.id);

    const formId = form.id;
    const googleSpreadsheetURL = form.googleSpreadsheetURL;

    res.status(201).json({
      success: true,
      form,
      formId,
      googleSpreadsheetURL,
    });
  } catch (error) {
    console.error("Error creating form with questions and sheet:", error);
    if (error.response && error.response.status === 500) {
      res.status(500).send("Server error. Please try again later.");
    } else {
      res.status(500).send("Error creating form with questions and sheet");
    }
  }
};

exports.getFormQuestions = async (req, res) => {

   try {
     const form = await Form.findById(req.params.id);

     if (!form) {
       return res.status(404).json({ success: false, message: "Form not found" });
     }

     const questions = form.questions;
     const googleSpreadsheetURL = form.googleSpreadsheetURL;

     res.status(200).json({
       success: true,
       questions,
       googleSpreadsheetURL
     });
   } catch (error) {
     console.error("Error fetching questions for form:", error);
     res
       .status(500)
       .json({ success: false, message: "Error fetching questions for form" });
   }
};


exports.storeQuestionsAndAnswers = async (req, res) => {

  const { spreadsheetId, data } = req.body;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!1:1", 
    });

    const existingData = response.data.values ? response.data.values[0] : [];
    const nextAvailableColumn = existingData.length + 1;
    const columnLetter = String.fromCharCode(64 + nextAvailableColumn); 

    const formattedData = data.map((question) => [question]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!${columnLetter}1`,
      valueInputOption: "RAW",
      resource: {
        values: formattedData,
      },
    });

    console.log("Data successfully stored in the spreadsheet.");

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error updating the spreadsheet:", error);
    res.status(500).send("Error updating the spreadsheet");
  }
};
