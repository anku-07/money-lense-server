const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must be associated with a user"],
    },

    status: {
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can be ACTIVE,FROZEN OR CLOSED",
      },
    },

    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
  },
  { timestamps: true },
);

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
