const accountRepository = require("../repositories/account.repository");
const AppError = require("../utils/AppError");

const createAccount = async (userId, payload) => {
  // Normalize Data
  payload.openingBalance = Number(payload.openingBalance) || 0;

  if (payload.upiId) {
    payload.upiId = payload.upiId.trim().toLowerCase();
  }

  if (payload.ifscCode) {
    payload.ifscCode = payload.ifscCode.trim().toUpperCase();
  }

  // Duplicate Bank Account
  if (payload.type === "bank") {
    const existingAccount = await accountRepository.findOne({
      user: userId,
      accountNumber: payload.accountNumber,
      isActive: true,
    });

    if (existingAccount) {
      throw new Error("Account number already exists.");
    }
  }

  // Duplicate Wallet
  if (payload.type === "wallet") {
    const existingWallet = await accountRepository.findOne({
      user: userId,
      upiId: payload.upiId,
      isActive: true,
    });

    if (existingWallet) {
      throw new Error("UPI ID already exists.");
    }
  }

  // First Account
  const accountCount = await accountRepository.countAccountsByUser(userId);

  const accountData = {
    ...payload,
    user: userId,
    currentBalance: payload.openingBalance,
    isDefault: accountCount === 0,
  };

  return await accountRepository.createAccount(accountData);
};

const getAllAccounts = async (userId) => {
  const accounts = await accountRepository.findAllAccountsByUser(userId);
  return accounts;
};

const getAccountById = async (id, userId) => {
  const account = await accountRepository.findAccountById(id, userId);
  if (!account) {
    throw new AppError("Account not found.", 404);
  }
  return account;
};

const updateAccount = async (id, userId, payload) => {
  const account = await accountRepository.findAccountById(id, userId);

  if (!account) {
    throw new AppError("Account not found.", 404);
  }
  const allowedFields = ["accountName", "bankName", "subType"];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  });

  return await accountRepository.updateAccount(id, updateData);
};

const changeDefaultAccount = async (accountId, userId) => {
  // Step 1: Check account exists
  const account = await accountRepository.findAccountById(accountId, userId);

  if (!account) {
    throw new AppError("Account not found.", 404);
  }

  // Step 2: Remove old default account
  await accountRepository.updateManyAccounts(
    {
      user: userId,
      isDefault: true,
      isActive: true,
    },
    {
      isDefault: false,
    },
  );

  // Step 3: Make selected account default
  const updatedAccount = await accountRepository.updateAccount(accountId, {
    isDefault: true,
  });

  return updatedAccount;
};

const archiveAccount = async (accountId, userId) => {
  const account = await accountRepository.findAccountById(accountId, userId);

  if (!account) {
    throw new AppError("Account not found.", 404);
  }

  if (account.isDefault) {
    throw new AppError("Default account cannot be archived.", 400);
  }

  const archivedAccount = await accountRepository.archiveAccount(
    accountId,
    userId,
  );

  return archivedAccount;
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  changeDefaultAccount,
  archiveAccount
};
