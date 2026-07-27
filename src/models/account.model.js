const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must be associated with a user"],
    },

    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["bank", "wallet", "cash", "credit_card"],
      required: true,
    },

    subType: {
      type: String,
      default: null,
    },

    bankName: {
      type: String,
      default: null,
      trim: true,
    },

    accountNumber: {
      type: String,
      default: null,
      trim: true,
    },

    ifscCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    upiId: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    openingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
