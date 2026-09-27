const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ApiError = require("./ApiError");


// ======================================
// JWT Configuration
// ======================================

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_SECRET;

const ACCESS_EXPIRES_IN =
  process.env.JWT_ACCESS_EXPIRES_IN ||
  "15m";

const REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN ||
  "7d";



// ======================================
// Duration Parser
// ======================================

const parseDurationToMs = (value) => {
  if (typeof value === "number") {
    return value;
  }

  const match = String(value)
    .trim()
    .match(/^(\d+)\s*(s|m|h|d|w)$/i);

  if (!match) {
    throw new Error(
      `Invalid duration: ${value}`
    );
  }

  const amount =
    Number(match[1]);

  const unit =
    match[2].toLowerCase();

  const multipliers = {
    s: 1000,

    m:
      60 * 1000,

    h:
      60 *
      60 *
      1000,

    d:
      24 *
      60 *
      60 *
      1000,

    w:
      7 *
      24 *
      60 *
      60 *
      1000,
  };

  return (
    amount *
    multipliers[unit]
  );
};



// ======================================
// Access Token Configuration
// ======================================

const assertAccessTokenConfig =
  () => {
    if (!ACCESS_SECRET) {
      throw new Error(
        "JWT access secret is not configured"
      );
    }
  };



// ======================================
// User Roles
// ======================================

const getUserRoles = (
  user
) => {
  /*
   * Support future multi-role
   * implementation.
   */

  if (
    Array.isArray(
      user.roles
    ) &&
    user.roles.length > 0
  ) {
    return user.roles;
  }

  /*
   * Current Lumora User model
   * uses a single role field.
   */

  if (user.role) {
    return [
      user.role,
    ];
  }

  return [
    "reader",
  ];
};



// ======================================
// Create Access Token
// ======================================

const createAccessToken = (
  user
) => {
  assertAccessTokenConfig();

  return jwt.sign(
    {
      /*
       * User ID
       */

      sub:
        String(
          user._id
        ),

      /*
       * User roles
       */

      roles:
        getUserRoles(
          user
        ),
    },

    ACCESS_SECRET,

    {
      expiresIn:
        ACCESS_EXPIRES_IN,
    }
  );
};



// ======================================
// Verify Access Token
// ======================================

const verifyAccessToken = (
  token
) => {
  assertAccessTokenConfig();

  try {
    return jwt.verify(
      token,
      ACCESS_SECRET
    );
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid access token"
    );
  }
};


// ======================================
// Refresh Token
// ======================================

/*
 * Generates a cryptographically
 * secure refresh token.
 *
 * The raw token is sent to the
 * browser through an HTTP-only cookie.
 */

const createRefreshToken = () => {
  return crypto
    .randomBytes(64)
    .toString("base64url");
};



// ======================================
// Hash Refresh Token
// ======================================

/*
 * We never store the raw refresh
 * token inside MongoDB.
 *
 * Only its SHA-256 hash is stored.
 */

const hashRefreshToken = (
  token
) => {
  if (!token) {
    return null;
  }

  return crypto
    .createHash(
      "sha256"
    )
    .update(token)
    .digest("hex");
};



// ======================================
// Refresh Token Expiry
// ======================================

const getRefreshExpiryDate =
  () => {
    return new Date(
      Date.now() +
        parseDurationToMs(
          REFRESH_EXPIRES_IN
        )
    );
  };



// ======================================
// Password Reset Token
// ======================================

/*
 * Generates a cryptographically
 * secure password reset token.
 *
 * 32 random bytes are converted
 * into a 64-character hexadecimal
 * string.
 *
 * Raw token:
 *
 * 64 characters
 *
 * The raw token is sent ONLY through
 * the password reset email.
 */

const createPasswordResetToken =
  () => {
    return crypto
      .randomBytes(32)
      .toString("hex");
  };



// ======================================
// Hash Password Reset Token
// ======================================

/*
 * The raw password reset token
 * must never be stored directly
 * in MongoDB.
 *
 * We store only its SHA-256 hash.
 */

const hashPasswordResetToken = (
  token
) => {
  if (!token) {
    return null;
  }

  return crypto
    .createHash(
      "sha256"
    )
    .update(token)
    .digest("hex");
};



// ======================================
// Exports
// ======================================

module.exports = {
  // Access token
  createAccessToken,
  verifyAccessToken,

  // Refresh token
  createRefreshToken,
  hashRefreshToken,
  getRefreshExpiryDate,

  // Password reset token
  createPasswordResetToken,
  hashPasswordResetToken,

  // Helpers
  parseDurationToMs,
  getUserRoles,
};