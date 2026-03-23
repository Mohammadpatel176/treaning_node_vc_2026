const express = require('express');
const customerRouter = require('./router/customerRouter')

const app = express();

app.use(express.json());

app.use("/api",customerRouter);

module.exports = app;