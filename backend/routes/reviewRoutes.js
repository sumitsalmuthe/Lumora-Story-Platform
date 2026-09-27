const express = require("express");

const router = express.Router();


const {

protect,

authorize

}=require("../middleware/authMiddleware");



const {

createReview,

getStoryReviews,

updateReview,

deleteReview,

getMyReview,

getReviewStats,

}=require("../controllers/review/reviewController");



const {

likeReview,

unlikeReview,

checkLike

}=require("../controllers/review/reviewLikeController");




// =======================================
// Review Stats
// =======================================

router.get(

"/stats/:storyId",

getReviewStats

);




// =======================================
// My Review
// =======================================

router.get(

"/my/:storyId",

protect,

authorize(

"reader",

"writer"

),

getMyReview

);




// =======================================
// Check Like
// =======================================

router.get(

"/:id/check-like",

protect,

checkLike

);




// =======================================
// Create Review
// =======================================

router.post(

"/:storyId",

protect,

authorize(

"reader",

"writer"

),

createReview

);




// =======================================
// Like Review
// =======================================

router.post(

"/:id/like",

protect,

authorize(

"reader",

"writer"

),

likeReview

);




// =======================================
// Unlike Review
// =======================================

router.delete(

"/:id/like",

protect,

authorize(

"reader",

"writer"

),

unlikeReview

);




// =======================================
// Get Story Reviews
// =======================================

router.get(

"/:storyId",

getStoryReviews

);




// =======================================
// Update Review
// =======================================

router.put(

"/:reviewId",

protect,

authorize(

"reader",

"writer",

"admin"

),

updateReview

);




// =======================================
// Delete Review
// =======================================

router.delete(

"/:reviewId",

protect,

authorize(

"reader",

"writer",

"admin"

),

deleteReview

);



module.exports = router;