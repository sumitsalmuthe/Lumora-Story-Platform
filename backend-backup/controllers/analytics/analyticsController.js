const mongoose = require("mongoose");

const Story = require("../../models/Story");
const Follow = require("../../models/Follow");
const Review = require("../../models/Review");
const ReadingHistory = require("../../models/ReadingHistory");




// ===================================================
// Dashboard Summary
// GET /api/analytics/dashboard
// ===================================================

exports.getDashboardSummary = async(req,res)=>{

try{


const writerId = req.user._id;





const totalStories =
await Story.countDocuments({

author:writerId,

isDeleted:false

});






const publishedStories =
await Story.countDocuments({

author:writerId,

status:"Published",

visibility:"Public",

isDeleted:false

});






const draftStories =
await Story.countDocuments({

author:writerId,

status:"Draft",

isDeleted:false

});






const totalFollowers =
await Follow.countDocuments({

following:writerId

});







const writerStories =
await Story.find({

author:writerId,

isDeleted:false

})
.select("_id views");






const reviews =
await Review.find({

story:{

$in:

writerStories.map(
story=>story._id
)

},

isDeleted:false

});






const totalReviews =
reviews.length;







const averageRating =

totalReviews > 0

?

Number(

(
reviews.reduce(

(sum,review)=>

sum + review.rating,

0

)

/

totalReviews

).toFixed(1)

)

:

0;







const totalViews =

writerStories.reduce(

(sum,story)=>

sum + (story.views || 0),

0

);







let totalReaders = 0;


try{


const uniqueReaders =

await ReadingHistory.distinct(

"user",

{

story:{

$in:

writerStories.map(
story=>story._id
)

}

}

);



totalReaders =
uniqueReaders.length;


}
catch(historyError){


console.error(

"Reading History Error:",

historyError.message

);

}







return res.status(200).json({

success:true,

dashboard:{

totalStories,

publishedStories,

draftStories,

totalFollowers,

totalReviews,

averageRating,

totalViews,

totalReaders

}

});


}
catch(error){


console.error(

"Dashboard Summary Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Story Analytics
// GET /api/analytics/story/:id
// ===================================================

exports.getStoryAnalytics = async(req,res)=>{


try{


const {
id
}=req.params;





if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}







const story =

await Story.findOne({

_id:id,

isDeleted:false

});







if(!story){

return res.status(404).json({

success:false,

message:"Story not found"

});

}







if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){

return res.status(403).json({

success:false,

message:"Unauthorized"

});

}







const uniqueReaders =

await ReadingHistory.distinct(

"user",

{

story:id

}

);








const reviews =

await Review.find({

story:id,

isDeleted:false

});






const totalReviews =
reviews.length;







const averageRating =

totalReviews > 0

?

Number(

(
reviews.reduce(

(sum,review)=>

sum + review.rating,

0

)

/

totalReviews

).toFixed(1)

)

:

0;







return res.status(200).json({

success:true,

analytics:{

storyId:story._id,

title:story.title,

status:story.status,

views:story.views || 0,

readers:uniqueReaders.length,

reviews:totalReviews,

averageRating,

createdAt:story.createdAt,

updatedAt:story.updatedAt

}

});


}
catch(error){


console.error(

"Story Analytics Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Followers Analytics
// GET /api/analytics/followers
// ===================================================

exports.getFollowersAnalytics = async(req,res)=>{


try{


const followers =

await Follow.find({

following:req.user._id

})

.populate({

path:"follower",

select:"username avatar createdAt"

})

.sort({

createdAt:-1

});







return res.status(200).json({

success:true,

totalFollowers:followers.length,

followers

});


}
catch(error){


console.error(

"Followers Analytics Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Reviews Analytics
// GET /api/analytics/reviews
// ===================================================

exports.getReviewsAnalytics = async(req,res)=>{


try{


const writerStories =

await Story.find({

author:req.user._id,

isDeleted:false

})
.select("_id");







const reviews =

await Review.find({

story:{

$in:

writerStories.map(

story=>story._id

)

},

isDeleted:false

})

.populate({

path:"user",

select:"username avatar"

})

.populate({

path:"story",

select:"title coverImage"

})

.sort({

createdAt:-1

});







const totalReviews =
reviews.length;







const averageRating =

totalReviews > 0

?

Number(

(
reviews.reduce(

(sum,review)=>

sum + review.rating,

0

)

/

totalReviews

).toFixed(1)

)

:

0;







const ratingDistribution = {

5:0,

4:0,

3:0,

2:0,

1:0

};







reviews.forEach((review)=>{


if(
ratingDistribution[review.rating]
!== undefined
){

ratingDistribution[review.rating]++;

}


});







return res.status(200).json({

success:true,

analytics:{

totalReviews,

averageRating,

ratingDistribution,

reviews

}

});


}
catch(error){


console.error(

"Reviews Analytics Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};