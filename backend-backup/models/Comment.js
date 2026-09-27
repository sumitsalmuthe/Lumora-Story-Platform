const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Story Reference
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Comment Text
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Parent Comment (for replies)
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    // Like System (Future)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Edit Status
    isEdited: {
      type: Boolean,
      default: false,
    },

    // Soft Delete Support
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// =============================
// Indexes
// =============================

// Fast loading of story comments
commentSchema.index({
  story: 1,
  createdAt: -1,
});

// Fast loading of replies
commentSchema.index({
  parentComment: 1,
  createdAt: 1,
});

// Fast loading of user comments
commentSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Comment",
  commentSchema
);