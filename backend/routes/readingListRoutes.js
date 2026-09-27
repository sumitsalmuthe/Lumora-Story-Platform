const express = require("express");

const router = express.Router();


const {
    protect
} = require("../middleware/authMiddleware");


const {

    createReadingList,

    getMyReadingLists,

    getReadingListById,

    updateReadingList,

    deleteReadingList,

    addStoryToReadingList,

    removeStoryFromReadingList,

} = require("../controllers/readingList/readingListController");




// ==========================================
// Reading List Routes
// ==========================================


// Create Reading List

router.post(
    "/",
    protect,
    createReadingList
);




// Get All Reading Lists

router.get(
    "/",
    protect,
    getMyReadingLists
);




// Get Single Reading List

router.get(
    "/:listId",
    protect,
    getReadingListById
);




// Update Reading List

router.put(
    "/:listId",
    protect,
    updateReadingList
);




// Delete Reading List

router.delete(
    "/:listId",
    protect,
    deleteReadingList
);




// Add Story To Reading List

router.post(
    "/:listId/stories/:storyId",
    protect,
    addStoryToReadingList
);




// Remove Story From Reading List

router.delete(
    "/:listId/stories/:storyId",
    protect,
    removeStoryFromReadingList
);



module.exports = router;