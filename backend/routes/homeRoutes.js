const express = require("express");

const router = express.Router();


const {
    getHomeData,
} = require("../controllers/home/homeController");



// ===================================================
// Home Route
// ===================================================


// GET /api/home

router.get(
    "/",
    getHomeData
);



module.exports = router;