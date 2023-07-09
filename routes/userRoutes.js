const express = require("express");
const {
  register,
  login,
  currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/current").get(validateToken, currentUser);
module.exports = router;
