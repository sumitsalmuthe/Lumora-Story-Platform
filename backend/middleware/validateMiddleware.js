const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (result.error) {
      const errors = result.error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return next(
        new ApiError(400, "Validation failed", errors)
      );
    }

    req.validatedBody = result.value;

    next();
  };
};

module.exports = validate;