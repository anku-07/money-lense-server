const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const {validateCreateAccount} = require("../validations/account.validation");
const { createAccount } = require("../controllers/account.controller");

router.post("/", protect,validateCreateAccount, createAccount);

module.exports = router;