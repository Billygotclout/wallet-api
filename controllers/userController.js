const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const userResource = require("../resources/userResource");
cloudinary.config({
  cloud_name: "dgmd8bmgm",
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_SECRET_KEY}`,
});

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ username });
  console.log();
  if (userAvailable) {
    res.status(401);
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const image = await cloudinary.uploader.upload(req.file.path);

  // remove file from server
  fs.unlink(`${req.file.path}`, (err) => {
    if (err) console.log(err);
  });

  if (!image) {
    res.status(400);
    throw new Error("Image could not be uploaded");
  }
  const user = await User.create({
    username,
    password: hashedPassword,
    profile_pic: image.secure_url,
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
  const correctLogin = username && bcrypt.compareSync(password, user.password);
  if (!correctLogin) {
    res.status(400);
    throw new Error("Invalid Username or Password");
  }

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "5h",
  });

  res.status(200).json({
    message: "User logged in ",
    token: token,
    data: user,
  });
});
const currentUser = asyncHandler(async (req, res) => {
  return userResource(req, res);
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const userAvailability = await User.findOne({ username });

  if (!userAvailability) {
    res.status(400);
    throw new Error("User not found");
  }
  const code = generateCode();
  const generatedCode = await User.findOneAndUpdate(
    { _id: userAvailability._id },
    { resetCode: code },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json({ message: "Code successfully sent", code: generatedCode });
});

const generateCode = () => {
  const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  return code;
};
const resetPassword = asyncHandler(async (req, res) => {
  const { code, username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  if (user.resetCode !== code) {
    res.status(400);
    throw new Error("Invalid reset code Please try again");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { _id: user._id },
    { password: hashedPassword },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json({ message: "Password successfully reset, please login and enjoy" });
});
module.exports = {
  login,
  register,
  resetPassword,
  currentUser,
  forgotPassword,
};
