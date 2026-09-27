const mongoose = require("mongoose");

const Story = require("../../models/Story");
const Chapter = require("../../models/Chapter");
const cloudinary = require("../../config/cloudinary");

// ===================================================
// GET ALL STORIES
// GET /api/v1/stories
// ===================================================

const getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      status: "Published",
      visibility: "Public",
    })
      .populate("author", "username avatar")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("Get Stories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// GET SINGLE STORY
// GET /api/v1/stories/:id
// ===================================================

const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id).populate(
      "author",
      "username avatar bio"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    const isOwner =
      req.user &&
      story.author._id.toString() ===
        req.user._id.toString();

    const isAdmin =
      req.user &&
      req.user.role === "admin";

    // Public users can only access
    // Published + Public stories.
    if (
      (story.status !== "Published" ||
        story.visibility !== "Public") &&
      !isOwner &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Story is not available",
      });
    }

    story.views += 1;

    await story.save();

    const chapters = await Chapter.find({
      story: story._id,
      status: "published",
    }).sort({
      chapterNumber: 1,
    });

    return res.status(200).json({
      success: true,
      story,
      chapters,
    });
  } catch (error) {
    console.error("Get Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// CREATE STORY
// POST /api/v1/stories
// ===================================================

const createStory = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      shortDescription,
      coverImage,
      category,
      language,
      storyType,
      tags,
      copyright,
      targetAudience,
      mature,
      status,
      visibility,
    } = req.body;

    if (!title || !shortDescription || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and category are required",
      });
    }

    const story = await Story.create({
      title: title.trim(),
      subtitle,
      shortDescription:
        shortDescription.trim(),
      coverImage,
      category,
      language,
      storyType,
      tags,
      copyright,
      targetAudience,
      mature,
      status: status || "Draft",
      visibility: visibility || "Public",
      author: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
    console.error("Create Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// UPDATE STORY
// PUT /api/v1/stories/:id
// ===================================================

const updateStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    if (
      story.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this story",
      });
    }

    const allowedFields = [
      "title",
      "subtitle",
      "shortDescription",
      "coverImage",
      "category",
      "language",
      "storyType",
      "tags",
      "copyright",
      "targetAudience",
      "mature",
      "visibility",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        story[field] = req.body[field];
      }
    });

    await story.save();

    return res.status(200).json({
      success: true,
      message: "Story updated successfully",
      story,
    });
  } catch (error) {
    console.error("Update Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// DELETE STORY
// DELETE /api/v1/stories/:id
// ===================================================

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    if (
      story.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this story",
      });
    }

    // Delete Cloudinary cover image.
    // Failure here should not stop story deletion.
    if (story.coverImage) {
      try {
        const publicId = story.coverImage
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinary.uploader.destroy(
          `storyhub/${publicId}`
        );
      } catch (error) {
        console.log(
          "Cloudinary Delete Failed:",
          error.message
        );
      }
    }

    await story.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("Delete Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// PUBLISH STORY
// PATCH /api/v1/stories/:id/publish
// ===================================================

const publishStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    if (
      story.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to publish this story",
      });
    }

    // A story must have at least one chapter
    // before publishing.
    const chapterCount =
      await Chapter.countDocuments({
        story: story._id,
      });

    if (chapterCount < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot publish a story without at least one chapter",
      });
    }

    story.status = "Published";

    await story.save();

    return res.status(200).json({
      success: true,
      message: "Story published successfully",
      story,
    });
  } catch (error) {
    console.error(
      "Publish Story Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// MOVE STORY TO DRAFT
// PATCH /api/v1/stories/:id/draft
// ===================================================

const draftStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    if (
      story.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to move this story",
      });
    }

    story.status = "Draft";

    await story.save();

    return res.status(200).json({
      success: true,
      message:
        "Story moved to draft successfully",
      story,
    });
  } catch (error) {
    console.error("Draft Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// COMPLETE STORY
// PATCH /api/v1/stories/:id/complete
// ===================================================

const completeStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story Not Found",
      });
    }

    if (
      story.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to complete this story",
      });
    }

    story.status = "Completed";

    await story.save();

    return res.status(200).json({
      success: true,
      message:
        "Story marked as completed successfully",
      story,
    });
  } catch (error) {
    console.error(
      "Complete Story Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// LIKE STORY
// POST /api/v1/stories/:id/like
// ===================================================

const likeStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const alreadyLiked = story.likes.some(
      (userId) =>
        userId.toString() ===
        req.user._id.toString()
    );

    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: "Story already liked",
      });
    }

    story.likes.push(req.user._id);

    await story.save();

    return res.status(200).json({
      success: true,
      message: "Story liked successfully",
      totalLikes: story.likes.length,
    });
  } catch (error) {
    console.error("Like Story Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// REMOVE LIKE
// DELETE /api/v1/stories/:id/like
// ===================================================

const removeLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const alreadyLiked = story.likes.some(
      (userId) =>
        userId.toString() ===
        req.user._id.toString()
    );

    if (!alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Story is not liked",
      });
    }

    story.likes = story.likes.filter(
      (userId) =>
        userId.toString() !==
        req.user._id.toString()
    );

    await story.save();

    return res.status(200).json({
      success: true,
      message: "Like removed successfully",
      totalLikes: story.likes.length,
    });
  } catch (error) {
    console.error(
      "Remove Like Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// CHECK LIKE
// GET /api/v1/stories/:id/check-like
// ===================================================

const checkLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const liked = story.likes.some(
      (userId) =>
        userId.toString() ===
        req.user._id.toString()
    );

    return res.status(200).json({
      success: true,
      liked,
      totalLikes: story.likes.length,
    });
  } catch (error) {
    console.error(
      "Check Like Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// GET MY STORIES
// GET /api/v1/stories/my
// ===================================================

const getMyStories = async (req, res) => {
  try {
    const stories = await Story.find({
      author: req.user._id,
    })
      .populate("author", "username avatar")
      .sort({
        createdAt: -1,
      });

    const storiesWithChapters =
      await Promise.all(
        stories.map(async (story) => {
          const chapterCount =
            await Chapter.countDocuments({
              story: story._id,
            });

          return {
            ...story.toObject(),
            chapterCount,
          };
        })
      );

    return res.status(200).json({
      success: true,
      count: storiesWithChapters.length,
      stories: storiesWithChapters,
    });
  } catch (error) {
    console.error(
      "Get My Stories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===================================================
// EXPORTS
// ===================================================

module.exports = {
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
};

