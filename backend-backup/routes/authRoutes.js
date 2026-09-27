const express = require("express");

const {
  registerUser,
  loginUser,
  refresh,
  logout,
  logoutAll,
  getMe,
  changePassword,
  becomeWriter,
} = require("../controllers/auth/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate =
  require("../middleware/validateMiddleware");

const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("../validators/authValidator");

const router =
  express.Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/logout",
  logout
);

router.post(
  "/logout-all",
  protect,
  logoutAll
);

router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

router.put(
  "/become-writer",
  protect,
  becomeWriter
);

module.exports = router;