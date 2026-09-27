const express = require("express");

const router = express.Router();



const {
    protect
} = require("../middleware/authMiddleware");



const {

createNotification,

getMyNotifications,

getUnreadCount,

markAsRead,

markAllAsRead,

deleteNotification,

} = require("../controllers/notification/notificationController");




// ==========================================
// Notification Routes
// ==========================================



// Get My Notifications

router.get(

"/",

protect,

getMyNotifications

);





// Get Unread Count

router.get(

"/unread-count",

protect,

getUnreadCount

);





// Mark All Read

router.put(

"/read-all",

protect,

markAllAsRead

);





// Mark Single Read

router.put(

"/:id/read",

protect,

markAsRead

);





// Delete Notification

router.delete(

"/:id",

protect,

deleteNotification

);





// Internal Notification Create
// Used by backend controllers

router.post(

"/",

protect,

createNotification

);





module.exports = router;