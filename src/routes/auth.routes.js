const express = require("express");
const authControllers = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Auth & User Access
router.post("/register", authControllers.userRegisterController);
router.post("/login", authControllers.userLoginController);
router.post("/logout", authControllers.logoutController);

// Forgot Password Workflow (3 Frontend Steps)
// Step 1: Submit Email -> Send 6-Digit OTP
router.post("/forgot-password", authControllers.forgotPasswordController);

// Step 2: Verify 6-Digit OTP Page
router.post("/verify-otp", authControllers.verifyResetOtpController);
router.post("/verify-reset-otp", authControllers.verifyResetOtpController);
router.post("/resend-otp", authControllers.resendOtpController);
router.post("/resend-verification", authControllers.resendOtpController);

// Step 3: Reset Password Page (newPassword & confirmPassword)
router.post("/reset-password", authControllers.resetPasswordController);

// Profile
router.get("/me", protect, authControllers.getMeController);

module.exports = router;