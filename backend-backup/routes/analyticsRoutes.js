const express = require("express");

const router = express.Router();



const {
    protect
} = require("../middleware/authMiddleware");



const {

    getDashboardSummary,

    getStoryAnalytics,

    getFollowersAnalytics,

    getReviewsAnalytics,

} = require("../controllers/analytics/analyticsController");




// =======================================
// Analytics Routes
// =======================================


// Dashboard Summary

router.get(
    "/dashboard",
    protect,
    getDashboardSummary
);



// Story Analytics

router.get(
    "/story/:id",
    protect,
    getStoryAnalytics
);



// Followers Analytics

router.get(
    "/followers",
    protect,
    getFollowersAnalytics
);



// Reviews Analytics

router.get(
    "/reviews",
    protect,
    getReviewsAnalytics
);



module.exports = router;