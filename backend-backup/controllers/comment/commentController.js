const mongoose = require("mongoose");

const Comment = require("../../models/Comment");
const Story = require("../../models/Story");
const Notification = require("../../models/Notification");




// ===================================================
// Create Comment
// POST /api/comments/:storyId
// ===================================================

exports.createComment = async(req,res)=>{

try{


const {
storyId
}=req.params;


const {
content
}=req.body;




// Validate Story ID

if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}






// Validate Content

if(
!content ||
content.trim()===""
){

return res.status(400).json({

success:false,

message:"Comment is required"

});

}






if(content.length > 1000){

return res.status(400).json({

success:false,

message:
"Comment cannot exceed 1000 characters"

});

}






// Check Story

const story =
await Story.findOne({

_id:storyId,

status:"Published",

visibility:"Public"

});





if(!story){

return res.status(404).json({

success:false,

message:"Story not found"

});

}







// Create Comment

const comment =
await Comment.create({

story:storyId,

user:req.user._id,

content:content.trim()

});







// Increase Comment Count

await Story.findByIdAndUpdate(

storyId,

{

$inc:{

comments:1

}

}

);








// Notification

try{


if(
story.author.toString()
!==
req.user._id.toString()

){


await Notification.create({

recipient:story.author,

sender:req.user._id,

type:"comment",

message:
`${req.user.username} commented on your story.`,

story:story._id,

comment:comment._id

});


}


}
catch(notificationError){

console.error(

"Comment Notification Error:",

notificationError.message

);

}







await comment.populate({

path:"user",

select:"username avatar"

});







return res.status(201).json({

success:true,

message:"Comment added successfully",

comment

});



}
catch(error){


console.error(

"Create Comment Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};











// ===================================================
// Get Story Comments
// GET /api/comments/:storyId
// ===================================================


exports.getStoryComments = async(req,res)=>{


try{


const {
storyId
}=req.params;




if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}






const comments =

await Comment.find({

story:storyId,

parentComment:null,

isDeleted:false

})

.populate({

path:"user",

select:"username avatar"

})

.sort({

createdAt:-1

});







const commentsWithReplyCount =

await Promise.all(

comments.map(async(comment)=>{


const replyCount =

await Comment.countDocuments({

parentComment:comment._id,

isDeleted:false

});




return {

...comment.toObject(),

replyCount

};


})

);








return res.status(200).json({

success:true,

count:commentsWithReplyCount.length,

comments:commentsWithReplyCount

});




}
catch(error){


console.error(

"Get Comments Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ===================================================
// Update Comment
// PUT /api/comments/:commentId
// ===================================================

exports.updateComment = async(req,res)=>{

try{


const {
commentId
}=req.params;


const {
content
}=req.body;




if(
!mongoose.Types.ObjectId.isValid(commentId)
){

return res.status(400).json({

success:false,

message:"Invalid Comment ID"

});

}





if(
!content ||
content.trim()===""
){

return res.status(400).json({

success:false,

message:"Comment content is required"

});

}





if(content.length > 1000){

return res.status(400).json({

success:false,

message:
"Comment cannot exceed 1000 characters"

});

}






const comment =
await Comment.findById(commentId);






if(
!comment ||
comment.isDeleted
){

return res.status(404).json({

success:false,

message:"Comment not found"

});

}







// Owner OR Admin

if(

comment.user.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){

return res.status(403).json({

success:false,

message:
"You are not allowed to edit this comment"

});

}







comment.content =
content.trim();


comment.isEdited = true;



await comment.save();






await comment.populate({

path:"user",

select:"username avatar"

});







return res.status(200).json({

success:true,

message:"Comment updated successfully",

comment

});



}
catch(error){


console.error(

"Update Comment Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Delete Comment (Soft Delete)
// DELETE /api/comments/:commentId
// ===================================================

exports.deleteComment = async(req,res)=>{

try{


const {
commentId
}=req.params;




if(
!mongoose.Types.ObjectId.isValid(commentId)
){

return res.status(400).json({

success:false,

message:"Invalid Comment ID"

});

}





const comment =
await Comment.findById(commentId);





if(
!comment ||
comment.isDeleted
){

return res.status(404).json({

success:false,

message:"Comment not found"

});

}






// Owner OR Admin

if(

comment.user.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){

return res.status(403).json({

success:false,

message:
"You are not allowed to delete this comment"

});

}







comment.isDeleted = true;

comment.content =
"[Deleted Comment]";

comment.likes = [];



await comment.save();







// Decrease count safely

await Story.findByIdAndUpdate(

comment.story,

{

$inc:{

comments:-1

}

}

);






return res.status(200).json({

success:true,

message:
"Comment deleted successfully"

});



}
catch(error){


console.error(

"Delete Comment Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Reply To Comment
// POST /api/comments/:commentId/reply
// ===================================================

exports.replyToComment = async(req,res)=>{

try{


const {
commentId
}=req.params;


const {
content
}=req.body;






if(
!mongoose.Types.ObjectId.isValid(commentId)
){

return res.status(400).json({

success:false,

message:"Invalid Comment ID"

});

}






if(
!content ||
content.trim()===""
){

return res.status(400).json({

success:false,

message:"Reply content is required"

});

}







if(content.length > 1000){

return res.status(400).json({

success:false,

message:
"Reply cannot exceed 1000 characters"

});

}







const parentComment =
await Comment.findById(commentId);





if(
!parentComment ||
parentComment.isDeleted
){

return res.status(404).json({

success:false,

message:
"Parent comment not found"

});

}






const reply =
await Comment.create({

story:parentComment.story,

user:req.user._id,

content:content.trim(),

parentComment:parentComment._id

});







// Reply Notification

try{


if(
parentComment.user.toString()
!==
req.user._id.toString()

){


await Notification.create({

recipient:parentComment.user,

sender:req.user._id,

type:"reply",

message:
`${req.user.username} replied to your comment.`,

story:parentComment.story,

comment:reply._id

});


}



}
catch(notificationError){


console.error(

"Reply Notification Error:",

notificationError.message

);

}






await reply.populate({

path:"user",

select:"username avatar"

});







return res.status(201).json({

success:true,

message:"Reply added successfully",

reply

});



}
catch(error){


console.error(

"Reply Comment Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ===================================================
// Get Replies
// GET /api/comments/replies/:commentId
// ===================================================

exports.getReplies = async(req,res)=>{


try{


const {
commentId
}=req.params;




if(
!mongoose.Types.ObjectId.isValid(commentId)
){

return res.status(400).json({

success:false,

message:"Invalid Comment ID"

});

}






const replies =

await Comment.find({

parentComment:commentId,

isDeleted:false

})

.populate({

path:"user",

select:"username avatar"

})

.sort({

createdAt:1

});






return res.status(200).json({

success:true,

count:replies.length,

replies

});



}
catch(error){


console.error(

"Get Replies Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};








// ===================================================
// Export Controllers
// ===================================================


module.exports = {


createComment:

exports.createComment,


getStoryComments:

exports.getStoryComments,


updateComment:

exports.updateComment,


deleteComment:

exports.deleteComment,


replyToComment:

exports.replyToComment,


getReplies:

exports.getReplies,


};