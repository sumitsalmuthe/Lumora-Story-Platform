const Joi = require("joi");

// ======================================
// Common Fields
// ======================================

const usernameSchema = Joi.string()
  .trim()
  .min(3)
  .max(30)
  .lowercase()
  .required();

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email()
  .max(254)
  .required();

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .required();

// ======================================
// Register
// ======================================

const registerSchema = Joi.object({
  username: usernameSchema,

  email: emailSchema,

  password: passwordSchema,
});

// ======================================
// Login
// ======================================

const loginSchema = Joi.object({
  email: emailSchema,

  password: passwordSchema,

  /*
   * Remember Me is optional so older
   * clients continue to work.
   */

  rememberMe: Joi.boolean().default(false),
});

// ======================================
// Google Login
// ======================================

const googleLoginSchema = Joi.object({
  /*
   * Google Identity Services sends
   * the ID token in the credential field.
   */

  credential: Joi.string()
    .trim()
    .min(20)
    .max(8192)
    .required(),
});

// ======================================
// Facebook Login
// ======================================

const facebookLoginSchema = Joi.object({
  /*
   * Facebook Login returns an access token.
   *
   * The backend will verify this token
   * with Facebook before creating/logging
   * into a Lumora account.
   */

  accessToken: Joi.string()
    .trim()
    .min(20)
    .max(8192)
    .required(),

  /*
   * Remember Me is handled by the frontend
   * session-storage decision. Keep this
   * optional for compatibility.
   */

  rememberMe: Joi.boolean().default(false),
});

// ======================================
// Change Password
// ======================================

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(1)
    .max(128)
    .required(),

  newPassword: passwordSchema.custom(
    (value, helpers) => {
      const currentPassword =
        helpers.state.ancestors[0].currentPassword;

      if (value === currentPassword) {
        return helpers.error("password.same");
      }

      return value;
    }
  ).messages({
    "password.same":
      "New password must differ from current password",
  }),
});

// ======================================
// Forgot Password
// ======================================

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

// ======================================
// Reset Password
// ======================================

const resetPasswordSchema = Joi.object({
  /*
   * Reset token is generated from
   * 32 random bytes -> 64 hex chars.
   */

  token: Joi.string()
    .trim()
    .length(64)
    .hex()
    .required(),

  newPassword: passwordSchema,
});

// ======================================
// Resend Email Verification
// ======================================

const resendVerificationSchema = Joi.object({
  email: emailSchema,
});

// ======================================
// Exports
// ======================================

module.exports = {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  facebookLoginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
};