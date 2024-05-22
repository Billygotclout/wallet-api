const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const userResource = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  let wallet = await Wallet.findOne({ user_id: req.user._id });
  let transactions = await Transaction.find({ user_id: req.user._id });
  if (!wallet) {
    wallet = [];
  }
  res.status(200).json({
    message: "user successfully fetched",
    user: user,
    wallet: wallet,
  });
});

module.exports = userResource;
