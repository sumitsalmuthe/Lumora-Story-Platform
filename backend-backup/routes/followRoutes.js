const express = require("express");

const router = express.Router();



const {
    protect
} = require("../middleware/authMiddleware");



const {

    followWriter,

    unfollowWriter,

    checkFollowing,

    getFollowers,

    getMyFollowing,

    getFollowCount,

} = require("../controllers/follow/followController");




// ==========================================
// Follow Routes
// ==========================================


// Get My Following

router.get(

    "/following",

    protect,

    getMyFollowing

);




// Check Follow Status

router.get(

    "/check/:writerId",

    protect,

    checkFollowing

);




// Get Followers Of Writer

router.get(

    "/followers/:writerId",

    getFollowers

);




// Get Follow Count

router.get(

    "/count/:writerId",

    getFollowCount

);




// Follow Writer

router.post(

    "/:writerId",

    protect,

    followWriter

);




// Unfollow Writer

router.delete(

    "/:writerId",

    protect,

    unfollowWriter

);



module.exports = router;