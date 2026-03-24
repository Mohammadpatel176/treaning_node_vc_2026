require('dotenv').config();
const express = require("express");
const emailRouter = require("../src/routes/test_route");

const app = express();
app.use(express.json());

app.use("/api/", emailRouter);

module.exports = app;