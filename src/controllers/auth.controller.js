const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const emailService = require("../services/email.services");

// Helper function to generate 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. Register API (No OTP required after registration - User can login directly)
const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isExists = await userModel.findOne({ email });

    if (isExists)
      return res
        .status(422)
        .json({ message: "User already exists", status: "failed" });

    const user = await userModel.create({
      name,
      email,
      password,
      isEmailVerified: true,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registration successful. You can now log in.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

    emailService
      .sendRegistrationEmail(user.email, user.name)
      .catch((err) => console.error("Welcome email failed:", err.message));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 2. Login API
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is invalid",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or password is invalid",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// 3. Forgot Password Step 1: Request OTP to Email
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: "failed",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email address",
        status: "failed",
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    emailService
      .sendPasswordResetEmail(user.email, user.name, otp)
      .catch((err) => console.error("Password reset email failed:", err.message));

    return res.status(200).json({
      message: "Password reset OTP sent successfully to your email. Valid for 1 minute.",
      status: "success",
      otp, // Convenient for testing
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Resend OTP API (1 Minute Expiration)
const resendOtpController = async (req, res) => {
  try {
    const email = req.body.email || (req.user && req.user.email);
    let user = null;

    if (email) {
      user = await userModel.findOne({ email });
    } else {
      user = await userModel.findOne({ resetPasswordOtp: { $ne: null } }).sort({ updatedAt: -1 });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please request an OTP using your email.",
        status: "failed",
      });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = otpExpires;
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = otpExpires;
    await user.save();

    emailService
      .sendPasswordResetEmail(user.email, user.name, otp)
      .catch((err) => console.error("Resend OTP email failed:", err.message));

    return res.status(200).json({
      message: "Resent OTP successfully to your email. Valid for 1 minute.",
      status: "success",
      otp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// 4. Forgot Password Step 2: Verify OTP
const verifyResetOtpController = async (req, res) => {
  try {
    const { email, otp, token } = req.body;
    const inputOtp = otp || token;

    if (!inputOtp) {
      return res.status(400).json({
        message: "6-digit OTP code is required",
        status: "failed",
      });
    }

    let queryCondition = {
      $or: [
        { resetPasswordOtp: inputOtp, resetPasswordOtpExpires: { $gt: Date.now() } },
        { resetPasswordToken: inputOtp, resetPasswordExpires: { $gt: Date.now() } },
      ],
    };

    if (email) {
      queryCondition.email = email;
    }

    const user = await userModel.findOne(queryCondition);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP code",
        status: "failed",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
      status: "success",
      email: user.email,
      otp: inputOtp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// 5. Forgot Password Step 3: Reset Password (newPassword + confirmPassword)
const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, token, newPassword, confirmPassword, confirmNewPassword, password } = req.body;
    const inputOtp = otp || token || req.params.token;
    const updatedPassword = newPassword || password;
    const confirmPass = confirmPassword || confirmNewPassword;

    if (!updatedPassword) {
      return res.status(400).json({
        message: "New password is required",
        status: "failed",
      });
    }

    if (confirmPass && updatedPassword !== confirmPass) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
        status: "failed",
      });
    }

    if (updatedPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        status: "failed",
      });
    }

    let user = null;

    if (email && inputOtp) {
      user = await userModel.findOne({
        email,
        $or: [
          { resetPasswordOtp: inputOtp, resetPasswordOtpExpires: { $gt: Date.now() } },
          { resetPasswordToken: inputOtp, resetPasswordExpires: { $gt: Date.now() } },
        ],
      });
    } else if (inputOtp) {
      user = await userModel.findOne({
        $or: [
          { resetPasswordOtp: inputOtp, resetPasswordOtpExpires: { $gt: Date.now() } },
          { resetPasswordToken: inputOtp, resetPasswordExpires: { $gt: Date.now() } },
        ],
      });
    } else if (email) {
      user = await userModel.findOne({
        email,
        resetPasswordOtpExpires: { $gt: Date.now() },
      });
    } else {
      // Pure 2-field form on frontend (neither email nor OTP in body)
      user = await userModel.findOne({
        $or: [
          { resetPasswordOtpExpires: { $gt: Date.now() } },
          { resetPasswordExpires: { $gt: Date.now() } },
        ],
      }).sort({ updatedAt: -1 });
    }

    if (!user) {
      return res.status(400).json({
        message: "Password reset session invalid or expired. Please request a new OTP.",
        status: "failed",
      });
    }

    user.password = updatedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful. You can now log in with your new password.",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Logout API
const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get Profile / Me API
const getMeController = async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
  forgotPasswordController,
  resendOtpController,
  resendVerificationController: resendOtpController,
  verifyResetOtpController,
  resetPasswordController,
  logoutController,
  getMeController,
};
