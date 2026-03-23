const mongoose = require("mongoose");

const tempAccountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("TempAccount", tempAccountSchema);