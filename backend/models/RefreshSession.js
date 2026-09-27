const mongoose = require("mongoose");

const refreshSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      select: false,
    },

    expiresAt: {
  type: Date,
  required: true,
},

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    replacedByTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    userAgent: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired sessions.
refreshSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Efficient session lookup for a user.
refreshSessionSchema.index({
  user: 1,
  revokedAt: 1,
  expiresAt: 1,
});

module.exports = mongoose.model(
  "RefreshSession",
  refreshSessionSchema
);