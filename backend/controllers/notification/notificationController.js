const mongoose = require("mongoose");

const Notification = require("../../models/Notification");
const User = require("../../models/User");
const Story = require("../../models/Story");
const Comment = require("../../models/Comment");
const Review = require("../../models/Review");



// ===================================================
// Create Notification
// POST /api/notifications
// ===================================================

exports.createNotification = async (req,res)=>{

try{


const {
recipient,
type,
message,
story,
comment,
review
}=req.body;



// Validate Recipient

if(
!recipient ||
!mongoose.Types.ObjectId.isValid(recipient)
){

return res.status(400).json({

success:false,

message:"Invalid Recipient ID"

});

}





if(!type || !message){

return res.status(400).json({

success:false,

message:"Type and message are required"

});

}





// Check Recipient

const recipientUser =
await User.findById(recipient);



if(!recipientUser){

return res.status(404).json({

success:false,

message:"Recipient not found"

});

}





// Validate Story

if(story){


if(
!mongoose.Types.ObjectId.isValid(story)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}




const storyExists =
await Story.findById(story);



if(!storyExists){

return res.status(404).json({

success:false,

message:"Story not found"

});

}


}





// Validate Comment

if(comment){


if(
!mongoose.Types.ObjectId.isValid(comment)
){

return res.status(400).json({

success:false,

message:"Invalid Comment ID"

});

}




const commentExists =
await Comment.findById(comment);



if(!commentExists){

return res.status(404).json({

success:false,

message:"Comment not found"

});

}


}





// Validate Review

if(review){


if(
!mongoose.Types.ObjectId.isValid(review)
){

return res.status(400).json({

success:false,

message:"Invalid Review ID"

});

}




const reviewExists =
await Review.findById(review);



if(!reviewExists){

return res.status(404).json({

success:false,

message:"Review not found"

});

}


}





const notification =
await Notification.create({

recipient,

sender:
req.user ? req.user._id : null,

type,

message,

story:story || null,

comment:comment || null,

review:review || null,

});






await notification.populate([

{

path:"sender",

select:"username avatar"

},

{

path:"recipient",

select:"username avatar"

},

{

path:"story",

select:"title coverImage"

},

{

path:"comment",

select:"content"

},

{

path:"review",

select:"rating comment"

}

]);







return res.status(201).json({

success:true,

message:"Notification created successfully",

notification

});



}
catch(error){


console.error(

"Create Notification Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Get My Notifications
// GET /api/notifications
// ===================================================

exports.getMyNotifications = async(req,res)=>{


try{


const notifications =

await Notification.find({

recipient:req.user._id

})

.populate({

path:"sender",

select:"username avatar"

})

.populate({

path:"story",

select:"title coverImage"

})

.sort({

createdAt:-1

});





return res.status(200).json({

success:true,

count:notifications.length,

notifications

});


}
catch(error){


console.error(

"Get Notifications Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Mark Notification As Read
// PUT /api/notifications/:id/read
// ===================================================

exports.markAsRead = async(req,res)=>{


try{


const {id}=req.params;




if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

success:false,

message:"Invalid Notification ID"

});

}





const notification =
await Notification.findById(id);





if(!notification){

return res.status(404).json({

success:false,

message:"Notification not found"

});

}





if(
notification.recipient.toString()
!==
req.user._id.toString()
){

return res.status(403).json({

success:false,

message:"Unauthorized"

});

}





notification.isRead=true;


await notification.save();






return res.status(200).json({

success:true,

message:"Notification marked as read",

notification

});


}
catch(error){


console.error(

"Mark Read Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Mark All Notifications As Read
// PUT /api/notifications/read-all
// ===================================================

exports.markAllAsRead = async(req,res)=>{


try{


await Notification.updateMany(

{

recipient:req.user._id,

isRead:false

},

{

$set:{

isRead:true

}

}

);





return res.status(200).json({

success:true,

message:"All notifications marked as read"

});


}
catch(error){


console.error(

"Mark All Read Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Delete Notification
// DELETE /api/notifications/:id
// ===================================================

exports.deleteNotification = async(req,res)=>{


try{


const {id}=req.params;




if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

success:false,

message:"Invalid Notification ID"

});

}





const notification =
await Notification.findById(id);





if(!notification){

return res.status(404).json({

success:false,

message:"Notification not found"

});

}





if(
notification.recipient.toString()
!==
req.user._id.toString()
){

return res.status(403).json({

success:false,

message:"Unauthorized"

});

}





await notification.deleteOne();





return res.status(200).json({

success:true,

message:"Notification deleted successfully"

});


}
catch(error){


console.error(

"Delete Notification Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Get Unread Notification Count
// GET /api/notifications/unread-count
// ===================================================

exports.getUnreadCount = async(req,res)=>{


try{


const unreadCount =
await Notification.countDocuments({

recipient:req.user._id,

isRead:false

});





return res.status(200).json({

success:true,

unreadCount

});


}
catch(error){


console.error(

"Unread Count Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};





module.exports = {

createNotification:exports.createNotification,

getMyNotifications:exports.getMyNotifications,

markAsRead:exports.markAsRead,

markAllAsRead:exports.markAllAsRead,

deleteNotification:exports.deleteNotification,

getUnreadCount:exports.getUnreadCount,

};