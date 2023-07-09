const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  type: {
    type: String,
    enum: ["Debit", "Credit"],
  },
  from: {
    type: String,
  },
  to: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Transaction", transactionSchema);
