const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Notification Receiver
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Notification Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: [
        "follow",
        "comment",
        "reply",
        "review",
        "story",
        "chapter",
        "system",
      ],
      required: true,
    },

    // Notification Message
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // Optional Story Reference
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      default: null,
    },

    // Optional Comment Reference
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    // Optional Review Reference
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },

    // Read Status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// INDEXES
// ======================================

// Fast notification lookup
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

// Fast unread notifications
notificationSchema.index({
  recipient: 1,
  isRead: 1,
});

// Notification type lookup
notificationSchema.index({
  type: 1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);