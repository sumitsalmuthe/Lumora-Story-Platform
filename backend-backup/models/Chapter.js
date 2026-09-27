const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },

    chapterNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);