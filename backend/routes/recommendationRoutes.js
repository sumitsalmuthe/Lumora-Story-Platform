const express = require("express");

const router = express.Router();


const {

  getRecommendations,

  getTrendingStories,

  getLatestStories,

  getSimilarStories,

  getRecommendedWriters,

} = require("../controllers/recommendation/recommendationController");




// ====================================
// Recommendation Routes
// ====================================


// Personalized Recommendations

router.get(
  "/",
  getRecommendations
);




// Trending Stories

router.get(
  "/trending",
  getTrendingStories
);




// Latest Stories

router.get(
  "/latest",
  getLatestStories
);




// Similar Stories

router.get(
  "/similar/:storyId",
  getSimilarStories
);




// Recommended Writers

router.get(
  "/writers",
  getRecommendedWriters
);



module.exports = router;