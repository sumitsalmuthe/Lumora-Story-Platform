const mongoose = require("mongoose");

const readingListSchema = new mongoose.Schema(
  {
    // Owner of the reading list
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Reading List Name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // Cover image for future use
    coverImage: {
      type: String,
      default: "",
    },

    // Public or Private list
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    // Default list created by system
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate list names for same user
readingListSchema.index(
  {
    user: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "ReadingList",
  readingListSchema
);