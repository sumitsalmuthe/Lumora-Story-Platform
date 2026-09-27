const express = require("express");

const router = express.Router();



const upload =
require("../middleware/uploadMiddleware");



const {

uploadImage

}=require("../controllers/upload/uploadController");






// ======================================
// Upload Image
// POST /api/upload
// ======================================


router.post(

"/",

upload.single("image"),

uploadImage

);





module.exports = router;