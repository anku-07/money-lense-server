const accountService = require("../services/account.service");
const asyncHandler = require("../utils/asyncHandler");

const createAccount = asyncHandler(async (req, res) => {
  const account = await accountService.createAccount(req.user._id, req.body);

  res.status(201).json({
    status: "success",
    message: "Account created successfully.",
    data: account,
  });
});

module.exports = {
  createAccount,
};


