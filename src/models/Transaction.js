const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TempAccount",
    default: null
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TempAccount",
    default: null
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw", "transfer"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);