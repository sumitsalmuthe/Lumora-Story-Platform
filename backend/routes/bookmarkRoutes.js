const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
  addBookmark,
  removeBookmark,
  getBookmarks,
  checkBookmark,
} = require("../controllers/bookmark/bookmarkController");

// Get all bookmarks
router.get("/", protect, getBookmarks);

// Check bookmark
router.get("/check/:storyId", protect, checkBookmark);

// Add bookmark
router.post("/:storyId", protect, addBookmark);

// Remove bookmark
router.delete("/:storyId", protect, removeBookmark);

module.exports = router;