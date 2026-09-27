const express = require("express");

const router = express.Router();


const {
    protect,
    authorize
} = require("../middleware/authMiddleware");



// Controllers

const {

    createComment,

    getStoryComments,

    updateComment,

    deleteComment,

    replyToComment,

    getReplies,

} = require("../controllers/comment/commentController");



// Comment Like Controller

const {

    likeComment,

    removeLike,

    checkLike,

} = require("../controllers/comment/commentLikeController");





// ==========================================
// REPLY ROUTES
// ==========================================


// Get Replies

router.get(

    "/replies/:commentId",

    getReplies

);




// Reply To Comment

router.post(

    "/:commentId/reply",

    protect,

    authorize(
        "reader",
        "writer",
        "admin"
    ),

    replyToComment

);





// ==========================================
// COMMENT LIKE ROUTES
// ==========================================


// Check Like

router.get(

    "/:id/check-like",

    protect,

    checkLike

);



// Like Comment

router.post(

    "/:id/like",

    protect,

    authorize(
        "reader",
        "writer",
        "admin"
    ),

    likeComment

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






// ==========================================
// MAIN COMMENT ROUTES
// ==========================================


// Add Comment

router.post(

    "/:storyId",

    protect,

    authorize(
        "reader",
        "writer",
        "admin"
    ),

    createComment

);



// Get Story Comments

router.get(

    "/:storyId",

    getStoryComments

);



// Update Comment

router.put(

    "/:commentId",

    protect,

    authorize(
        "reader",
        "writer",
        "admin"
    ),

    updateComment

);



// Delete Comment

router.delete(

    "/:commentId",

    protect,

    authorize(
        "reader",
        "writer",
        "admin"
    ),

    deleteComment

);



module.exports = router;