const User = require("../models/User");

const {
  verifyAccessToken,
  getUserRoles,
} = require("../utils/tokenUtils");

const ApiError = require("../utils/ApiError");

// ======================================
// Protect
// ======================================

const protect = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization || "";

    if (
      !authorization.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const token =
      authorization.slice(7).trim();

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const decoded =
      verifyAccessToken(token);

    const userId =
      decoded.sub || decoded.id;

    if (!userId) {
      throw new ApiError(
        401,
        "Invalid access token"
      );
    }

    const user =
      await User.findById(userId)
        .select("-password");

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Account is disabled"
      );
    }

    req.user = user;

    req.auth = {
      userId: user._id,
      roles: getUserRoles(user),
      tokenPayload: decoded,
    };

    next();
  } catch (error) {
    next(error);
  }
};


// ======================================
// Authorize
// ======================================

const authorize = (...requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          "Authentication required"
        );
      }

      const userRoles =
        getUserRoles(req.user);

      const allowed =
        requiredRoles.some((role) =>
          userRoles.includes(role)
        );

      if (!allowed) {
        throw new ApiError(
          403,
          "You don't have permission for this action"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


// ======================================
// Exports
// ======================================

module.exports = {
  protect,
  authorize,
};