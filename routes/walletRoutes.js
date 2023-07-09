const express = require("express");
const validateToken = require("../middleware/validateToken");
const {
  createWallet,
  walletBalance,
  addMoney,
  withdraw,
  wallet2Wallet,
} = require("../controllers/walletController");

const router = express.Router();

router.use(validateToken);

router.route("/create").post(createWallet);
router.route("/balance").get(walletBalance);
router.route("/fund").post(addMoney);
router.route("/withdraw").post(withdraw);
router.route("/wallet2wallet").post(wallet2Wallet);

module.exports = router;
