const authService =
  require("../../services/authService");

const passwordResetService =
  require("../../services/passwordResetService");

const emailVerificationService =
  require("../../services/emailVerificationService");

const {
  toSafeUser,
} = require("../../utils/authResponse");

// ======================================
// Refresh Cookie Configuration
// ======================================

const REFRESH_COOKIE =
  "lumora_refresh";

const isProduction =
  process.env.NODE_ENV ===
  "production";

// ======================================
// Refresh Cookie Options
// ======================================

const refreshCookieOptions = () => ({
  httpOnly: true,

  secure: isProduction,

  sameSite:
    process.env.COOKIE_SAMESITE ||
    "lax",

  path: "/api/v1/auth",

  maxAge:
    7 *
    24 *
    60 *
    60 *
    1000,
});

// ======================================
// Set Refresh Cookie
// ======================================

const setRefreshCookie = (
  res,
  refreshToken
) => {
  res.cookie(
    REFRESH_COOKIE,
    refreshToken,
    refreshCookieOptions()
  );
};

// ======================================
// Clear Refresh Cookie
// ======================================

const clearRefreshCookie = (
  res
) => {
  const options =
    refreshCookieOptions();

  delete options.maxAge;

  res.clearCookie(
    REFRESH_COOKIE,
    options
  );
};

// ======================================
// Request Metadata
// ======================================

const requestMeta = (req) => ({
  userAgent:
    req.get("user-agent") || "",

  ipAddress:
    req.ip || "",
});

// ======================================
// Register
// ======================================

const registerUser = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.register({
        ...req.validatedBody,
        ...requestMeta(req),
      });

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully. Please check your email to verify your account.",

      data: {
        user:
          toSafeUser(
            result.user
          ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Login
// ======================================

const loginUser = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.login({
        ...req.validatedBody,
        ...requestMeta(req),
      });

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      data: {
        user:
          toSafeUser(
            result.user
          ),

        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Google Login / Signup
// ======================================

const googleLogin = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.googleLogin({
        credential:
          req.validatedBody
            .credential,

        ...requestMeta(req),
      });

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(200).json({
      success: true,

      message:
        "Google login successful",

      data: {
        user:
          toSafeUser(
            result.user
          ),

        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Facebook Login / Signup
// ======================================

const facebookLogin = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.facebookLogin({
        accessToken:
          req.validatedBody
            .accessToken,

        ...requestMeta(req),
      });

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(200).json({
      success: true,

      message:
        "Facebook login successful",

      data: {
        user:
          toSafeUser(
            result.user
          ),

        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Refresh Session
// ======================================

const refresh = async (
  req,
  res,
  next
) => {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_COOKIE
      ];

    const result =
      await authService.rotateSession({
        refreshToken,

        ...requestMeta(req),
      });

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(200).json({
      success: true,

      message:
        "Session refreshed",

      data: {
        user:
          toSafeUser(
            result.user
          ),

        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);

    next(error);
  }
};

// ======================================
// Logout
// ======================================

const logout = async (
  req,
  res,
  next
) => {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_COOKIE
      ];

    await authService.revokeSession(
      refreshToken
    );

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,

      message:
        "Logged out successfully",

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Logout All Sessions
// ======================================

const logoutAll = async (
  req,
  res,
  next
) => {
  try {
    await authService.revokeAllSessions(
      req.user._id
    );

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,

      message:
        "All sessions revoked",

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Get Current User
// ======================================

const getMe = async (
  req,
  res,
  next
) => {
  try {
    return res.status(200).json({
      success: true,

      message:
        "Authenticated user",

      data: {
        user:
          toSafeUser(
            req.user
          ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Change Password
// ======================================

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    await authService.changePassword({
      userId:
        req.user._id,

      currentPassword:
        req.validatedBody
          .currentPassword,

      newPassword:
        req.validatedBody
          .newPassword,
    });

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,

      message:
        "Password changed successfully. Please sign in again.",

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Become Writer
// ======================================

const becomeWriter = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.becomeWriter({
        userId:
          req.user._id,

        ...requestMeta(req),
      });

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(200).json({
      success: true,

      message:
        "You are now a writer",

      data: {
        user:
          toSafeUser(
            result.user
          ),

        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Forgot Password
// ======================================

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    await passwordResetService
      .requestPasswordReset({
        email:
          req.validatedBody.email,
      });

    return res.status(200).json({
      success: true,

      message:
        "If an account exists for that email, a password reset link has been sent.",

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Reset Password
// ======================================

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    await passwordResetService
      .resetPassword({
        token:
          req.validatedBody
            .token,

        newPassword:
          req.validatedBody
            .newPassword,
      });

    return res.status(200).json({
      success: true,

      message:
        "Password reset successfully. Please sign in again.",

      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Verify Email
// ======================================

const verifyEmail = async (
  req,
  res,
  next
) => {
  console.log(
    "🟣 VERIFY CONTROLLER START"
  );

  try {
    const token =
      req.query?.token;

    console.log(
      "🟣 TOKEN RECEIVED:",
      token ? "YES" : "NO"
    );

    const user =
      await emailVerificationService.verifyEmail(
        token
      );

    console.log(
      "🟢 VERIFY CONTROLLER SUCCESS"
    );

    return res.status(200).json({
      success: true,

      message:
        "Email verified successfully.",

      data: {
        user:
          toSafeUser(user),
      },
    });
  } catch (error) {
    console.log(
      "🔴 VERIFY CONTROLLER ERROR:",
      error
    );

    next(error);
  }
};

// ======================================
// Resend Email Verification
// ======================================

const resendVerificationEmail =
  async (
    req,
    res,
    next
  ) => {
    try {
      const email =
        req.body?.email;

      const result =
        await emailVerificationService
          .resendVerificationEmail(
            email
          );

      return res.status(200).json({
        success: true,

        message:
          result?.alreadyVerified
            ? "This email address is already verified."
            : "If an account exists for that email, a new verification link has been sent.",

        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

// ======================================
// Exports
// ======================================

module.exports = {
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
};