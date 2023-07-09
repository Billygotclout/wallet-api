const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
module.exports = mongoose.model("Wallet", walletSchema);
