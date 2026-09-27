console.log("=== ReadingHistory Model Loaded ===");

const mongoose = require("mongoose");

const readingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    lastChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastReadAt: {
      type: Date,
      default: Date.now,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

readingHistorySchema.index(
  { user: 1, story: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ReadingHistory",
  readingHistorySchema
);