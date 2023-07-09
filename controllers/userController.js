const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userResource = require("../resources/userResource");

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ username });
  if (userAvailable) {
    res.status(401);
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
  });
  res.status(201).json({
    message: "User successfully registered",
    data: user,
  });
});
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ username });
  if (username && bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).json({
      message: "User logged in ",
      token: token,
      data: user,
    });
  }
});
const currentUser = asyncHandler(async (req, res) => {
  return userResource(req, res);
});

module.exports = { login, register, currentUser };
