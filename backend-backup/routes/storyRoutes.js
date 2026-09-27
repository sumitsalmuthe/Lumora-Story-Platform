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





// ==============================
// PUBLIC STORY ROUTES
// ==============================


// Get All Published Stories

router.get(
"/",
getStories
);




// ==============================
// WRITER ROUTES
// IMPORTANT: /my ABOVE /:id
// ==============================


// Get My Stories

router.get(

"/my",

protect,

authorize(
"writer",
"admin"
),

getMyStories

);




// Create Story

router.post(

"/",

protect,

authorize(
"writer",
"admin"
),

createStory

);




// Update Story

router.put(

"/:id",

protect,

authorize(
"writer",
"admin"
),

updateStory

);




// Delete Story

router.delete(

"/:id",

protect,

authorize(
"writer",
"admin"
),

deleteStory

);




// Publish Story

router.patch(

"/:id/publish",

protect,

authorize(
"writer",
"admin"
),

publishStory

);




// Move Story To Draft

router.patch(

"/:id/draft",

protect,

authorize(
"writer",
"admin"
),

draftStory

);




// ==============================
// PUBLIC SINGLE STORY
// ==============================


// Get Single Story

router.get(

"/:id",

getStoryById

);





// ==============================
// LIKE SYSTEM
// ==============================


// Check Like

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





module.exports = router;