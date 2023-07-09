const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const userResource = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const wallet = await Wallet.findOne({ user_id: req.user._id });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  res.status(200).json({
    message: "user successfully fetched",
    user: user,
    wallet: wallet,
  });
});

module.exports = userResource;
