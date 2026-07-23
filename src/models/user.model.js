const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSechma = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Email should be a valid email"],
      unique: [true, "Email already exists"],
    },
    name: {
      type: String,
      required: [true, "name is required for creating a account"],
    },

    password: {
      type: String,
      required: [true, "password is required for creating a account"],
      trim: true,
      minLenght: [6, "password must be at least 6 characters long"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    emailVerificationOtp: {
      type: String,
      default: null,
    },
    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSechma.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSechma.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSechma);

module.exports = userModel;
