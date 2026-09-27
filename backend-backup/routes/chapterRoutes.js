const express = require("express");

const router = express.Router();



const {

getChapters,

getChapterById,

createChapter,

updateChapter,

deleteChapter,

publishChapter,

moveChapterToDraft,

} = require("../controllers/chapter/chapterController");



const {

protect,

authorize,

} = require("../middleware/authMiddleware");






// ===================================================
// GET ALL CHAPTERS OF STORY
// GET /api/chapters/story/:storyId
// ===================================================

router.get(
"/story/:storyId",
getChapters
);







// ===================================================
// GET SINGLE CHAPTER
// GET /api/chapters/:id
// ===================================================

router.get(
"/:id",
getChapterById
);








// ===================================================
// CREATE CHAPTER
// POST /api/chapters
// ===================================================

router.post(

"/",

protect,

authorize(
"writer",
"admin"
),

createChapter

);








// ===================================================
// UPDATE CHAPTER
// PUT /api/chapters/:id
// ===================================================

router.put(

"/:id",

protect,

authorize(
"writer",
"admin"
),

updateChapter

);








// ===================================================
// DELETE CHAPTER
// DELETE /api/chapters/:id
// ===================================================

router.delete(

"/:id",

protect,

authorize(
"writer",
"admin"
),

deleteChapter

);








// ===================================================
// PUBLISH CHAPTER
// PATCH /api/chapters/:id/publish
// ===================================================

router.patch(

"/:id/publish",

protect,

authorize(
"writer",
"admin"
),

publishChapter

);








// ===================================================
// MOVE TO DRAFT
// PATCH /api/chapters/:id/draft
// ===================================================

router.patch(

"/:id/draft",

protect,

authorize(
"writer",
"admin"
),

moveChapterToDraft

);







module.exports = router;