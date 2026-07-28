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

// Get All account by user
const getAllAccounts = asyncHandler(async (req, res) => {
  const accounts = await accountService.getAllAccounts(req.user._id);

  return res.status(200).json({
    status: "success",
    message: "Accounts fetched successfully.",
    data: accounts,
  });
});

const getAccountById = asyncHandler(async (req, res) => {
  const account = await accountService.getAccountById(
    req.params.id,
    req.user._id,
  );

  res.status(200).json({
    status: "success",
    message: "Account fetched successfully.",
    data: account,
  });
});

const updateAccount = asyncHandler(async (req, res) => {
  const account = await accountService.updateAccount(
    req.params.id,
    req.user._id,
    req.body,
  );

  return res.status(200).json({
    status: "success",
    message: "Account updated successfully.",
    data: account,
  });
});

const changeDefaultAccount = asyncHandler(async (req, res) => {
  const account = await accountService.changeDefaultAccount(
    req.params.id,
    req.user._id,
  );

  return res.status(200).json({
    status: "success",
    message: "Default account changed successfully.",
    data: account,
  });
});

const archiveAccount = asyncHandler(async (req, res) => {
  const account = await accountService.archiveAccount(
    req.params.id,
    req.user._id,
  );

  return res.status(200).json({
    status: "success",
    message: "Account archived successfully.",
    data: account,
  });
});

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  changeDefaultAccount,
  archiveAccount
};
