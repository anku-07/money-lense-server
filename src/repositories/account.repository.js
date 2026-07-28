const Account = require("../models/account.model");

const createAccount = async (payload) => {
  return await Account.create(payload);
};

const findOne = async (filter) => {
  return await Account.findOne(filter);
};

const countAccountsByUser = async (userId) => {
  return await Account.countDocuments({
    user: userId,
    isActive: true,
  });
};

const findAllAccountsByUser = async (userId) => {
  return await Account.find({
    user: userId,
    isActive: true,
  }).sort({ createdAt: -1 });
};

const findAccountById = async (id, userId) => {
  return await Account.findOne({
    _id: id,
    user: userId,
    isActive: true,
  });
};

const updateAccount = async (id, payload) => {
  return await Account.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const updateManyAccounts = async (filter, payload) => {
  return await Account.updateMany(filter, payload);
};

const archiveAccount = async (id) => {
  return await Account.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    {
      new: true,
    },
  );
};

module.exports = {
  createAccount,
  findOne,
  countAccountsByUser,
  findAllAccountsByUser,
  findAccountById,
  updateAccount,
  updateManyAccounts,
  archiveAccount,
};
