const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  
  questions: [
    {
      type: String,
      required: true,
    },
  ],

  googleSpreadsheetURL: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Form", formSchema);
