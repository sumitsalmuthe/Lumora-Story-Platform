const express = require("express");

const router = express.Router();

const {
  globalSearch,
  searchStories,
  searchUsers,
  searchTags,
} = require("../controllers/search/searchController");

// ===================================================
// Search Routes
// ===================================================

// Global Search
// GET /api/search?q=keyword
router.get("/", globalSearch);

// Search Stories
// GET /api/search/stories?q=keyword
router.get("/stories", searchStories);

// Search Writers
// GET /api/search/users?q=keyword
router.get("/users", searchUsers);

// Search Tags
// GET /api/search/tags?q=keyword
router.get("/tags", searchTags);

module.exports = router;