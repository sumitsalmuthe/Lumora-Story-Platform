const express = require("express");

// ======================================
// Controllers
// ======================================

const {
  registerUser,
  loginUser,
  googleLogin,
  facebookLogin,
  refresh,
  logout,
  logoutAll,
  getMe,
  changePassword,
  becomeWriter,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/auth/authController");

// ======================================
// Validators
// ======================================

const {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  facebookLoginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
} = require("../validators/authValidator");

// ======================================
// Middleware
// ======================================

const validate = require("../middleware/validateMiddleware");

const {
  protect,
} = require("../middleware/authMiddleware");

// ======================================
// Router
// ======================================

const router = express.Router();

// ======================================
// Public Authentication Routes
// ======================================

// Register
router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

// Google Login / Signup
router.post(
  "/google",
  validate(googleLoginSchema),
  googleLogin
);

// Facebook Login / Signup
router.post(
  "/facebook",
  validate(facebookLoginSchema),
  facebookLogin
);

// Refresh Access Token
router.post(
  "/refresh",
  refresh
);

// Logout Current Session
router.post(
  "/logout",
  logout
);

// Forgot Password
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

// Verify Email
router.get(
  "/verify-email",
  verifyEmail
);

// ======================================
// Protected Authentication Routes
// ======================================

// Logout All Sessions
router.post(
  "/logout-all",
  protect,
  logoutAll
);

// Get Current User
router.get(
  "/me",
  protect,
  getMe
);

// Change Password
router.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

// Become Writer
router.put(
  "/become-writer",
  protect,
  becomeWriter
);

// ======================================
// Resend Email Verification
// ======================================

router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationEmail
);

// ======================================
// Export
// ======================================

module.exports = router;