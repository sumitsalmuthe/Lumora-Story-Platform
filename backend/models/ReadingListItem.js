const mongoose = require("mongoose");

const readingListItemSchema = new mongoose.Schema(
  {
    // Reading List Reference
    readingList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReadingList",
      required: true,
      index: true,
    },

    // Story Reference
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    // Position of story inside list
    order: {
      type: Number,
      default: 0,
    },

    // Date Added
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate stories in same reading list
readingListItemSchema.index(
  {
    readingList: 1,
    story: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "ReadingListItem",
  readingListItemSchema
);