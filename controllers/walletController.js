const asyncHandler = require("express-async-handler");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const createWallet = asyncHandler(async (req, res) => {
  const walletAvailable = await Wallet.findOne({
    user_id: req.user._id,
  });
  if (walletAvailable) {
    res.status(401);
    throw new Error("User already has existing wallet");
  }
  const wallet = await Wallet.create({
    user_id: req.user._id,
  });
  res.status(201).json({
    message: "Wallet successfully created ",
    data: wallet,
  });
});
const walletBalance = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ user_id: req.user._id });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  res.status(200).json(wallet);
});
const addMoney = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ user_id: req.user._id });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }
  const balance = wallet.amount + parseInt(amount);
  const updatedBalance = await Wallet.findOneAndUpdate(
    { user_id: req.user._id },
    { amount: balance },
    {
      new: true,
    }
  );
  await Transaction.create({
    user_id: req.user._id,
    from: "Bank",
    to: req.user.username,
    type: "Credit",
    amount,
  });
  res
    .status(200)
    .json({ message: "Account funded", data: updatedBalance.amount });
});
const withdraw = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ user_id: req.user._id });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }
  if (wallet.amount <= parseInt(amount)) {
    res.status(400);
    throw new Error("Insufficient Balance");
  }
  const balance = wallet.amount - parseInt(amount);
  await Transaction.create({
    user_id: req.user._id,
    to: "Bank",
    from: req.user.username,
    type: "Debit",
    amount,
  });
  const updatedBalance = await Wallet.findOneAndUpdate(
    { user_id: req.user._id },
    { amount: balance },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json({ message: "Withdrawal Successful", data: updatedBalance });
});
const wallet2Wallet = asyncHandler(async (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const receiver = await User.findOne({ username });

  if (!receiver) {
    res.status(404);
    throw new Error("User not found");
  }
  const wallet = await Wallet.findOne({ user_id: req.user._id });
  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }
  if (username === req.user.username) {
    res.status(404);
    throw new Error("User cannot transfer money to self");
  }
  if (wallet.amount < parseInt(amount)) {
    res.status(400);
    throw new Error("Insufficient Balance");
  }
  const balance = wallet.amount - parseInt(amount);
  const receiverWallet = await Wallet.findOne({ user_id: receiver._id });
  if (!receiverWallet) {
    res.status(400);
    throw new Error("User doesnt have existing wallet");
  }
  const receiverBalance = receiverWallet.amount + parseInt(amount);
  await Transaction.create({
    user_id: req.user._id,
    to: receiver.username,
    from: req.user.username,
    type: "Debit",
    amount,
  });
  await Transaction.create({
    user_id: req.user._id,
    to: req.user.username,
    from: receiver.username,
    type: "Credit",
    amount,
  });
  const updatedBalance = await Wallet.findOneAndUpdate(
    { user_id: req.user._id },
    { amount: balance },
    {
      new: true,
    }
  );
  const receiversUpdatedBalance = await Wallet.findOneAndUpdate(
    { user_id: receiver._id },
    { amount: receiverBalance },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: `Money Successfully sent to ${receiver.username}`,
    data: updatedBalance,
    receiver: receiversUpdatedBalance,
  });
});

module.exports = {
  createWallet,
  walletBalance,
  addMoney,
  withdraw,
  wallet2Wallet,
};
