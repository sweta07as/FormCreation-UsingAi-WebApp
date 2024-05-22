const app = require("./app");
const express = require("express");

const dotenv = require("dotenv");
const connectDatabase = require("./database");

//config
dotenv.config({ path: "config/config.env" });


//deployment
const path = require("path");
const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../frontend/build");
app.use(express.static(buildpath));
//

//Connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
