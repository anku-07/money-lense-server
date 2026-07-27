const accountRepository = require("../repositories/account.repository");

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

module.exports = {
  createAccount,
};