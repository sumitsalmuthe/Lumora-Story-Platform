const express = require("express");

const router = express.Router();


const {
    protect
} = require("../middleware/authMiddleware");



const {

    getMyProfile,

    updateMyProfile,

    getProfileById,

    getProfileByUsername,

    updateAvatar,

    getWriterStats,

    getAllWriters,

} = require("../controllers/profile/profileController");





// ======================================
// My Profile
// ======================================

router.get(
    "/me",
    protect,
    getMyProfile
);



router.put(
    "/me",
    protect,
    updateMyProfile
);




// ======================================
// Avatar
// ======================================

router.put(
    "/avatar",
    protect,
    updateAvatar
);




// ======================================
// Writers
// ======================================

router.get(
    "/writers",
    getAllWriters
);




// ======================================
// Profile Lookup
// ======================================

router.get(
    "/id/:id",
    getProfileById
);



router.get(
    "/username/:username",
    getProfileByUsername
);




// ======================================
// Writer Stats
// ======================================

router.get(
    "/:id/stats",
    getWriterStats
);



module.exports = router;