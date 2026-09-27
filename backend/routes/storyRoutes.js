const express = require("express");

const router = express.Router();

// ==============================
// Controllers
// ==============================

const {
  getStories,
  getMyStories,
  createStory,
  updateStory,
  deleteStory,
  getStoryById,
  publishStory,
  draftStory,
  completeStory,
  likeStory,
  removeLike,
  checkLike,
} = require("../controllers/story/storyController");

// ==============================
// Middleware
// ==============================

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ===================================================
// PUBLIC STORY ROUTES
// ===================================================

// Get All Published Public Stories
router.get("/", getStories);

// ===================================================
// WRITER STORY ROUTES
// IMPORTANT:
// /my MUST come before /:id
// ===================================================

// Get Logged-In Writer's Stories
router.get(
  "/my",
  protect,
  authorize("writer", "admin"),
  getMyStories
);

// Create Story
router.post(
  "/",
  protect,
  authorize("writer", "admin"),
  createStory
);

// Update Story
router.put(
  "/:id",
  protect,
  authorize("writer", "admin"),
  updateStory
);

// Delete Story
router.delete(
  "/:id",
  protect,
  authorize("writer", "admin"),
  deleteStory
);

// Publish Story
router.patch(
  "/:id/publish",
  protect,
  authorize("writer", "admin"),
  publishStory
);

// Move Story To Draft
router.patch(
  "/:id/draft",
  protect,
  authorize("writer", "admin"),
  draftStory
);

// Complete Story
router.patch(
  "/:id/complete",
  protect,
  authorize("writer", "admin"),
  completeStory
);

// ===================================================
// LIKE SYSTEM
// IMPORTANT:
// These routes MUST come before GET /:id
// ===================================================

// Check Like Status
router.get(
  "/:id/check-like",
  protect,
  checkLike
);

// Like Story
router.post(
  "/:id/like",
  protect,
  authorize(
    "reader",
    "writer",
    "admin"
  ),
  likeStory
);

// Remove Like
router.delete(
  "/:id/like",
  protect,
  authorize(
    "reader",
    "writer",
    "admin"
  ),
  removeLike
);

// ===================================================
// WRITER STORY EDIT
// IMPORTANT:
// This route allows the owner to open
// Draft / Private stories.
// ===================================================

router.get(
  "/:id/edit",
  protect,
  authorize("writer", "admin"),
  getStoryById
);

// ===================================================
// PUBLIC SINGLE STORY
// IMPORTANT:
// Keep this route LAST
// ===================================================

// Get Single Published/Public Story
router.get(
  "/:id",
  getStoryById
);

module.exports = router;