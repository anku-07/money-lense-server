const validateCreateAccount = (req, res, next) => {
  const {
    accountName,
    type,
    bankName,
    accountNumber,
    ifscCode,
    upiId,
    openingBalance,
  } = req.body;

  if (!accountName || !type) {
    return res.status(400).json({
      status: "failed",
      message: "Account name and type are required.",
    });
  }

  const validTypes = ["bank", "wallet", "cash", "credit_card"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid account type.",
    });
  }

  if (openingBalance < 0) {
    return res.status(400).json({
      status: "failed",
      message: "Opening balance cannot be negative.",
    });
  }

  if (type === "bank") {
    if (!bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({
        status: "failed",
        message: "Bank name, account number and IFSC code are required.",
      });
    }
  }

  if (type === "wallet") {
    if (!bankName || !upiId) {
      return res.status(400).json({
        status: "failed",
        message: "Wallet name and UPI ID are required.",
      });
    }
  }

  next();
};


module.exports = {
  validateCreateAccount,
};
