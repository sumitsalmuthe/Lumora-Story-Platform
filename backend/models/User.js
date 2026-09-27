const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // =========================================================
    // BASIC USER INFORMATION
    // =========================================================

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    // =========================================================
    // SOCIAL AUTHENTICATION
    // =========================================================

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    facebookId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
      required: true,
    },

    // =========================================================
    // PASSWORD
    // =========================================================

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
      select: false,
    },

    // =========================================================
    // PROFILE
    // =========================================================

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

  // =========================================================
// ROLE
// =========================================================

role: {
  type: String,
  enum: ["reader", "writer", "admin"],
  default: "reader",
},

roles: {
  type: [String],
  enum: ["reader", "writer", "admin"],
  default: ["reader"],
},

    // =========================================================
    // EMAIL VERIFICATION
    // =========================================================

    verified: {
      type: Boolean,
      default: false,
    },

    // =========================================================
    // ACCOUNT STATUS
    // =========================================================

    isActive: {
      type: Boolean,
      default: true,
    },

    // =========================================================
    // WRITER PROFILE
    // =========================================================

    writerProfile: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // =========================================================
    // LOGIN INFORMATION
    // =========================================================

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =============================================================
// PASSWORD HASHING
// =============================================================
//
// Password is hashed automatically whenever:
// - user registers
// - user changes password
// - user resets password
//
// IMPORTANT:
// authService.js should assign the plain new password and call
// user.save(). This middleware will hash it automatically.
//
// =============================================================

userSchema.pre("save", async function () {
  // Password has not changed → do nothing
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(this.password, salt);
});

// =============================================================
// PASSWORD COMPARISON
// =============================================================
//
// Used during login/change-password.
//
// Example:
// const isValid = await user.matchPassword(password);
//
// =============================================================

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }

  return bcrypt.compare(enteredPassword, this.password);
};

// =============================================================
// MODEL
// =============================================================

module.exports = mongoose.model("User", userSchema);