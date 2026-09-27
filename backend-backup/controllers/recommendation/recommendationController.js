const mongoose = require("mongoose");

const Story = require("../../models/Story");
const User = require("../../models/User");
const Follow = require("../../models/Follow");
const Review = require("../../models/Review");

// ===================================================
// Personalized Recommendations
// GET /api/recommendations
// ===================================================
exports.getRecommendations = async (req, res) => {
  try {

    const stories = await Story.find({
      status: "Published",
      visibility: "Public",
    })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: stories.length,
      stories,
    });

  } catch (error) {

    console.error(
      "Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================================
// Trending Stories
// GET /api/recommendations/trending
// ===================================================
exports.getTrendingStories = async (req, res) => {
  try {

    const stories = await Story.find({
      status: "Published",
      visibility: "Public",
    })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .sort({
        views: -1,
        comments: -1,
        createdAt: -1,
      })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: stories.length,
      stories,
    });

  } catch (error) {

    console.error(
      "Trending Stories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================================
// Latest Stories
// GET /api/recommendations/latest
// ===================================================
exports.getLatestStories = async (req, res) => {
  try {

    const stories = await Story.find({
      status: "Published",
      visibility: "Public",
    })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: stories.length,
      stories,
    });

  } catch (error) {

    console.error(
      "Latest Stories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================================
// Similar Stories
// GET /api/recommendations/similar/:storyId
// ===================================================
exports.getSimilarStories = async (req, res) => {
  try {

    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Story ID",
      });
    }

    const currentStory = await Story.findById(storyId);

    if (!currentStory) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const stories = await Story.find({
      _id: { $ne: storyId },
      status: "Published",
      visibility: "Public",
      category: currentStory.category,
      language: currentStory.language,
    })
      .populate({
        path: "author",
        select: "username avatar",
      })
      .sort({
 views:-1,
 likes:-1,
 comments:-1,
 createdAt:-1
})
      .limit(10);

    return res.status(200).json({
      success: true,
      currentStory: currentStory.title,
      count: stories.length,
      stories,
    });

  } catch (error) {

    console.error(
      "Similar Stories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===================================================
// Popular Writers
// GET /api/recommendations/writers
// ===================================================
exports.getRecommendedWriters = async (req, res) => {
    try {

    const writers = await User.find({
      role: "writer",
    })
      .select(
        "username avatar bio verified createdAt"
      )
      .sort({
        createdAt: -1,
      });

    const writerData = await Promise.all(
      writers.map(async (writer) => {

        const stories = await Story.find({
          author: writer._id,
          status: "Published",
        }).select("_id");

        const totalStories = stories.length;

        const totalFollowers =
          await Follow.countDocuments({
            following: writer._id,
          });

        const reviews =
          await Review.find({
            story: {
              $in: stories.map(
                (story) => story._id
              ),
            },
            isDeleted: false,
          });

        const averageRating =
          reviews.length > 0
            ? Number(
                (
                  reviews.reduce(
                    (sum, review) =>
                      sum + review.rating,
                    0
                  ) / reviews.length
                ).toFixed(1)
              )
            : 0;

        return {
          _id: writer._id,
          username: writer.username,
          avatar: writer.avatar,
          bio: writer.bio,
          verified: writer.verified,
          totalStories,
          totalFollowers,
          averageRating,
        };

      })
    );

    writerData.sort((a, b) => {

      if (
        b.totalFollowers !==
        a.totalFollowers
      ) {
        return (
          b.totalFollowers -
          a.totalFollowers
        );
      }

      if (
        b.averageRating !==
        a.averageRating
      ) {
        return (
          b.averageRating -
          a.averageRating
        );
      }

      return (
        b.totalStories -
        a.totalStories
      );

    });

    return res.status(200).json({
      success: true,
      count: writerData.length,
      writers: writerData,
    });

  } catch (error) {

    console.error(
      "Popular Writers Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};