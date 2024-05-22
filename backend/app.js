const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config({ path: "config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //added later
app.use(cors());

//Route Imports
const form = require("./routes/formRoute");

app.use("/api/v1", form);



module.exports = app;