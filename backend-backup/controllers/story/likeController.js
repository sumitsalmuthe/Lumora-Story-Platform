const mongoose = require("mongoose");
const Story = require("../../models/Story");

// =====================================
// Like Story
// POST /api/stories/:id/like
// =====================================

exports.likeStory = async (req, res) => {

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

    const alreadyLiked =
story.likes.some(

(userId)=>

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

    res.status(200).json({

      success: true,

      message: "Story liked successfully",

      totalLikes: story.likes.length,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// =====================================
// Unlike Story
// DELETE /api/stories/:id/like
// =====================================

exports.removeLike = async (req, res) => {

  try {

    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {

      return res.status(404).json({

        success: false,

        message: "Story not found",

      });

    }

    story.likes = story.likes.filter(

      (userId) =>

        userId.toString() !==

        req.user._id.toString()

    );

    await story.save();

    res.json({

      success: true,

      message: "Like removed successfully",

      totalLikes: story.likes.length,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// =====================================
// Check Like Status
// GET /api/stories/:id/check-like
// =====================================

exports.checkLike = async (req, res) => {

  try {

    const story = await Story.findById(
      req.params.id
    );

    if (!story) {

      return res.status(404).json({

        success: false,

        message: "Story not found",

      });

    }

    const liked = req.user

?

story.likes.some(

(userId)=>

userId.toString() ===

req.user._id.toString()

)

:

false;

    res.json({

      success: true,

      liked,

      totalLikes: story.likes.length,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};