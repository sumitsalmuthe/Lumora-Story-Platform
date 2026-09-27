const mongoose = require("mongoose");

const Review = require("../../models/Review");
const Story = require("../../models/Story");
const Notification = require("../../models/Notification");




// ======================================================
// Create Review
// POST /api/reviews/:storyId
// ======================================================

exports.createReview = async (req,res)=>{

try{


const {storyId}=req.params;

const {
rating,
review
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





// Validate Rating

const numericRating =
Number(rating);



if(
!numericRating ||
numericRating < 1 ||
numericRating > 5
){

return res.status(400).json({

success:false,

message:"Rating must be between 1 and 5"

});

}





// Validate Review Length

if(
review &&
review.length > 1000
){

return res.status(400).json({

success:false,

message:"Review cannot exceed 1000 characters"

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





// Check Existing Review

const existingReview =
await Review.findOne({

story:storyId,

user:req.user._id,

isDeleted:false

});





if(existingReview){

return res.status(400).json({

success:false,

message:"You already reviewed this story"

});

}





// Create Review

const newReview =
await Review.create({

story:storyId,

user:req.user._id,

rating:numericRating,

review:
review?.trim() || ""

});







// Notification (safe)

try{


if(
story.author.toString()
!==
req.user._id.toString()
){

await Notification.create({

recipient:story.author,

sender:req.user._id,

type:"review",

message:
`${req.user.username} reviewed your story.`,

story:story._id,

review:newReview._id

});

}


}
catch(notificationError){

console.error(

"Review Notification Error:",

notificationError.message

);

}







await newReview.populate({

path:"user",

select:"username avatar"

});






return res.status(201).json({

success:true,

message:"Review added successfully",

review:newReview

});



}
catch(error){


console.error(

"Create Review Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};







// ======================================================
// Get Story Reviews
// GET /api/reviews/:storyId
// ======================================================


exports.getStoryReviews = async(req,res)=>{

try{


const {storyId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}






const reviews =
await Review.find({

story:storyId,

isDeleted:false

})

.populate({

path:"user",

select:"username avatar"

})

.sort({

createdAt:-1

});






return res.status(200).json({

success:true,

count:reviews.length,

reviews

});



}
catch(error){


console.error(

"Get Reviews Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ======================================================
// Update Review
// PUT /api/reviews/:reviewId
// ======================================================

exports.updateReview = async(req,res)=>{

try{


const {reviewId}=req.params;

const {
rating,
review
}=req.body;



if(
!mongoose.Types.ObjectId.isValid(reviewId)
){

return res.status(400).json({

success:false,

message:"Invalid Review ID"

});

}





const existingReview =
await Review.findById(reviewId);





if(!existingReview || existingReview.isDeleted){

return res.status(404).json({

success:false,

message:"Review not found"

});

}





// Owner OR Admin Check

if(

existingReview.user.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){

return res.status(403).json({

success:false,

message:
"You are not allowed to edit this review"

});

}







// Optional Rating Update

if(rating !== undefined){


const numericRating =
Number(rating);



if(
!numericRating ||
numericRating < 1 ||
numericRating > 5
){

return res.status(400).json({

success:false,

message:"Rating must be between 1 and 5"

});

}



existingReview.rating =
numericRating;


}







// Review Text Update

if(review !== undefined){


if(review.length > 1000){

return res.status(400).json({

success:false,

message:
"Review cannot exceed 1000 characters"

});

}



existingReview.review =
review.trim();


}






existingReview.isEdited = true;


await existingReview.save();






await existingReview.populate({

path:"user",

select:"username avatar"

});







return res.status(200).json({

success:true,

message:"Review updated successfully",

review:existingReview

});



}
catch(error){


console.error(

"Update Review Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ======================================================
// Delete Review (Soft Delete)
// DELETE /api/reviews/:reviewId
// ======================================================


exports.deleteReview = async(req,res)=>{

try{


const {reviewId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(reviewId)
){

return res.status(400).json({

success:false,

message:"Invalid Review ID"

});

}







const existingReview =
await Review.findById(reviewId);





if(!existingReview){

return res.status(404).json({

success:false,

message:"Review not found"

});

}





if(existingReview.isDeleted){

return res.status(400).json({

success:false,

message:"Review already deleted"

});

}






// Owner OR Admin

if(

existingReview.user.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){

return res.status(403).json({

success:false,

message:
"You are not allowed to delete this review"

});

}







existingReview.review =
"[Deleted Review]";


existingReview.likes = [];


existingReview.isDeleted = true;



await existingReview.save();






return res.status(200).json({

success:true,

message:
"Review deleted successfully"

});



}
catch(error){


console.error(

"Delete Review Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ======================================================
// Get My Review
// GET /api/reviews/my/:storyId
// ======================================================


exports.getMyReview = async(req,res)=>{


try{


const {storyId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}





const review =
await Review.findOne({

story:storyId,

user:req.user._id,

isDeleted:false

})

.populate({

path:"user",

select:"username avatar"

});






if(!review){

return res.status(404).json({

success:false,

message:
"You have not reviewed this story"

});

}






return res.status(200).json({

success:true,

review

});



}
catch(error){


console.error(

"Get My Review Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ======================================================
// Get Review Statistics
// GET /api/reviews/stats/:storyId
// ======================================================

exports.getReviewStats = async(req,res)=>{

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





const reviews =
await Review.find({

story:storyId,

isDeleted:false

});







const totalReviews =
reviews.length;





const ratings = {

1:0,

2:0,

3:0,

4:0,

5:0

};





let totalRating = 0;





reviews.forEach((item)=>{


totalRating += item.rating;


ratings[item.rating]++;


});






const averageRating =
totalReviews > 0

?

Number(

(
totalRating /
totalReviews

).toFixed(1)

)

:

0;







return res.status(200).json({

success:true,

totalReviews,

averageRating,

ratings

});



}
catch(error){


console.error(

"Review Stats Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};







// ======================================================
// Export Controllers
// ======================================================


module.exports = {

createReview:

exports.createReview,


getStoryReviews:

exports.getStoryReviews,


updateReview:

exports.updateReview,


deleteReview:

exports.deleteReview,


getMyReview:

exports.getMyReview,


getReviewStats:

exports.getReviewStats,

};