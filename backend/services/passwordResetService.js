const crypto = require("crypto");

const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const RefreshSession = require("../models/RefreshSession");

const ApiError = require("../utils/ApiError");

const { sendPasswordResetEmail } = require("./emailService");

const RESET_TOKEN_EXPIRY_MINUTES = 15;

const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  /*
   * Never reveal whether an email exists.
   */
  if (!user) {
    return;
  }

  /*
   * Remove previous unused reset tokens.
   */
  await PasswordResetToken.deleteMany({
    user: user._id,
  });

  /*
   * Generate a secure random token.
   */
  const rawToken = crypto
    .randomBytes(32)
    .toString("hex");

  /*
   * Only the SHA-256 hash is stored in MongoDB.
   */
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() +
      RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  /*
   * Store the reset token.
   *
   * Keep the created document in resetToken so
   * we can delete it if email sending fails.
   */
  const resetToken = await PasswordResetToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const resetUrl =
    `${frontendUrl}/reset-password?token=${encodeURIComponent(
      rawToken
    )}`;

  /*
   * Send password reset email.
   */
  try {
    await sendPasswordResetEmail({
  to: user.email,
  username: user.username,
  resetUrl,
});
  } catch (error) {
    /*
     * Print the original Nodemailer/SMTP error
     * so we can diagnose email configuration.
     */
    console.error(
      "PASSWORD RESET EMAIL ERROR:",
      error
    );

    /*
     * Email failed, so invalidate the reset token.
     */
    await PasswordResetToken.deleteOne({
      _id: resetToken._id,
    });

    throw new ApiError(
      500,
      "Unable to send password reset email"
    );
  }
};

const resetPassword = async ({
  token,
  newPassword,
}) => {
  if (!token) {
    throw new ApiError(
      400,
      "Password reset token is required"
    );
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetToken =
    await PasswordResetToken.findOne({
      tokenHash,
    });

  if (!resetToken) {
    throw new ApiError(
      400,
      "Invalid or expired password reset link"
    );
  }

  if (
    resetToken.usedAt ||
    resetToken.expiresAt <= new Date()
  ) {
    throw new ApiError(
      400,
      "Invalid or expired password reset link"
    );
  }

  const user = await User.findById(
    resetToken.user
  );

  if (!user || !user.isActive) {
    throw new ApiError(
      400,
      "Unable to reset password"
    );
  }

  /*
   * Update password.
   *
   * User pre-save middleware will hash it.
   */
  user.password = newPassword;

  await user.save();

  /*
   * Immediately invalidate the reset token.
   */
  resetToken.usedAt = new Date();

  await resetToken.save();

  /*
   * Password reset is a sensitive operation.
   * Revoke all existing refresh sessions.
   */
  await RefreshSession.updateMany(
    {
      user: user._id,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );

  /*
   * Remove any remaining reset tokens
   * belonging to this user.
   */
  await PasswordResetToken.deleteMany({
    user: user._id,
  });
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};