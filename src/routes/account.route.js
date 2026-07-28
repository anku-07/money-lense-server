const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { validateCreateAccount } = require("../validations/account.validation");
const accountController = require("../controllers/account.controller");

router.post(
  "/",
  protect,
  validateCreateAccount,
  accountController.createAccount,
);

router.get("/", protect, accountController.getAllAccounts);
router.get("/:id", protect, accountController.getAccountById);
router.patch("/:id/default", protect, accountController.changeDefaultAccount);
router.patch("/:id", protect, accountController.updateAccount);
router.delete("/:id", protect, accountController.archiveAccount);

module.exports = router;
