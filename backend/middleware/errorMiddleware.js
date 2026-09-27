const ApiError =
  require("../utils/ApiError");

// ======================================
// Global Error Middleware
// ======================================

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  let error = err;

  // ======================================
  // Log Unexpected Errors
  // ======================================

  if (!(error instanceof ApiError)) {
    console.error(
      "Unhandled Error:",
      error
    );
  }

  // ======================================
  // Default Error
  // ======================================

  let statusCode =
    error.statusCode || 500;

  let message =
    statusCode >= 500
      ? "Internal server error"
      : error.message ||
        "Request failed";

  let errors =
    Array.isArray(error.errors)
      ? error.errors
      : [];

  // ======================================
  // Mongoose Validation Error
  // ======================================

  if (
    error.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    message =
      "Validation failed";

    errors = Object.values(
      error.errors
    ).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  // ======================================
  // MongoDB Duplicate Key
  // ======================================

  if (error.code === 11000) {
    statusCode = 409;

    message =
      "Duplicate value";

    errors = Object.keys(
      error.keyValue || {}
    ).map((field) => ({
      field,

      message:
        `${field} already exists`,
    }));
  }

  // ======================================
  // JWT Expired
  // ======================================

  if (
    error.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;

    message =
      "Authentication token expired";
  }

  // ======================================
  // JWT Invalid
  // ======================================

  if (
    error.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;

    message =
      "Invalid authentication token";
  }

  // ======================================
  // Response
  // ======================================

  return res.status(statusCode).json({
    success: false,

    message,

    errors,

    data:
      error.data ?? null,
  });
};

// ======================================
// Export
// ======================================

module.exports =
  errorMiddleware;