const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  updateReadingHistory,
  getReadingHistory,
  clearReadingHistory,
} = require("../controllers/readingHistory/readingHistoryController");

// ===================================================
// Reading History Routes
// ===================================================

// Get logged-in user's reading history
router.get("/", protect, getReadingHistory);

// Add / Update reading history
router.post("/:storyId", protect, updateReadingHistory);

// Clear reading history
router.delete("/", protect, clearReadingHistory);

module.exports = router;