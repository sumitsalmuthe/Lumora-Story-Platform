const crypto = require("crypto");

const User = require("../models/User");
const EmailVerificationToken =
  require("../models/EmailVerificationToken");

const ApiError =
  require("../utils/ApiError");

const {
  sendEmailVerificationEmail,
} = require("./emailService");

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 15;


// ======================================
// Create Verification Token
// ======================================

const createEmailVerificationToken =
  async (user) => {
    if (!user) {
      throw new ApiError(
        500,
        "Unable to create email verification token"
      );
    }

    if (user.verified) {
      return null;
    }

    // Remove old verification tokens
    await EmailVerificationToken.deleteMany({
      user: user._id,
    });

    // Generate raw token
    const rawToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    // Hash token before database storage
    const tokenHash =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt =
      new Date(
        Date.now() +
          VERIFICATION_TOKEN_EXPIRY_MINUTES *
            60 *
            1000
      );

    await EmailVerificationToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const verificationUrl =
      `${frontendUrl}/verify-email?token=${rawToken}`;

    try {
      await sendEmailVerificationEmail({
        to: user.email,
        username: user.username,
        verificationUrl,
      });
    } catch (error) {
      // Remove token if email failed
      await EmailVerificationToken.deleteOne({
        tokenHash,
      });

      console.error(
        "Email verification email failed:",
        error
      );

      throw new ApiError(
        500,
        "Unable to send email verification email"
      );
    }

    return {
      expiresAt,
    };
  };


// ======================================
// Verify Email
// ======================================

const verifyEmail = async (
  rawToken
) => {
  if (!rawToken) {
    throw new ApiError(
      400,
      "Email verification token is required"
    );
  }

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  const verificationToken =
    await EmailVerificationToken.findOne({
      tokenHash,
    });

  if (!verificationToken) {
    throw new ApiError(
      400,
      "Invalid or expired email verification link"
    );
  }

  if (
    verificationToken.expiresAt <=
    new Date()
  ) {
    await EmailVerificationToken.deleteOne({
      _id: verificationToken._id,
    });

    throw new ApiError(
      400,
      "Invalid or expired email verification link"
    );
  }

  const user =
    await User.findById(
      verificationToken.user
    );

  if (!user) {
    await EmailVerificationToken.deleteOne({
      _id: verificationToken._id,
    });

    throw new ApiError(
      404,
      "User account not found"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated"
    );
  }

  // Mark account verified
  user.verified = true;

  await user.save();

  // Token can no longer be reused
  await EmailVerificationToken.deleteOne({
    _id: verificationToken._id,
  });

  return user;
};


// ======================================
// Resend Verification Email
// ======================================

const resendVerificationEmail = async (email) => {
  if (!email) {
    throw new ApiError(
      400,
      "Email address is required"
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await User.findOne({
      email: normalizedEmail,
    });

  // Don't reveal whether the email exists.
  if (!user) {
    return {
      sent: true,
    };
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated"
    );
  }

  if (user.verified) {
    return {
      alreadyVerified: true,
      sent: false,
    };
  }

  // ======================================
  // Resend Cooldown
  // ======================================

  const existingToken =
    await EmailVerificationToken.findOne({
      user: user._id,
    }).select("createdAt");

  if (existingToken) {
    const cooldownMs = 60 * 1000;

    const elapsed =
      Date.now() -
      existingToken.createdAt.getTime();

    if (elapsed < cooldownMs) {
      throw new ApiError(
        429,
        "Please wait 60 seconds before requesting another verification email."
      );
    }
  }

  // ======================================
  // Create New Verification Token
  // ======================================

  await createEmailVerificationToken(user);

  return {
    alreadyVerified: false,
    sent: true,
  };
};


module.exports = {
  createEmailVerificationToken,
  verifyEmail,
  resendVerificationEmail,
};