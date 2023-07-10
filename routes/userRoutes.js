const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  currentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const upload = multer({ dest: "uploads/" });

const validateToken = require("../middleware/validateToken");

const router = express.Router();
router.route("/register").post(upload.single("profile_pic"), register);
router.route("/login").post(login);
router.route("/current").get(validateToken, currentUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
module.exports = router;
