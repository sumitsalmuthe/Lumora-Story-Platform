const mongoose = require("mongoose");

const Follow = require("../../models/Follow");
const User = require("../../models/User");
const Notification = require("../../models/Notification");



// ===================================================
// Follow Writer
// POST /api/follows/:writerId
// ===================================================

exports.followWriter = async (req,res)=>{

try{


const {writerId}=req.params;



if(
!mongoose.Types.ObjectId.isValid(writerId)
){

return res.status(400).json({

success:false,

message:"Invalid Writer ID"

});

}





if(
req.user._id.toString() === writerId
){

return res.status(400).json({

success:false,

message:"You cannot follow yourself"

});

}






const writer =
await User.findOne({

_id:writerId,

role:"writer",

isActive:true

});





if(!writer){

return res.status(404).json({

success:false,

message:"Writer not found"

});

}







const existingFollow =
await Follow.findOne({

follower:req.user._id,

following:writerId

});





if(existingFollow){

return res.status(409).json({

success:false,

message:"Already following this writer"

});

}






const follow =
await Follow.create({

follower:req.user._id,

following:writerId

});






// Notification

try{


await Notification.create({

recipient:writerId,

sender:req.user._id,

type:"follow",

message:
`${req.user.username} started following you`

});


}
catch(notificationError){

console.error(
"Notification Error:",
notificationError.message
);

}







return res.status(201).json({

success:true,

message:"Writer followed successfully",

follow

});



}
catch(error){


console.error(
"Follow Writer Error:",
error
);



if(error.code === 11000){

return res.status(409).json({

success:false,

message:"Already following this writer"

});

}




return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Unfollow Writer
// DELETE /api/follows/:writerId
// ===================================================

exports.unfollowWriter = async(req,res)=>{


try{


const {writerId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(writerId)
){

return res.status(400).json({

success:false,

message:"Invalid Writer ID"

});

}





const follow =
await Follow.findOneAndDelete({

follower:req.user._id,

following:writerId

});





if(!follow){

return res.status(404).json({

success:false,

message:"You are not following this writer"

});

}





return res.status(200).json({

success:true,

message:"Writer unfollowed successfully"

});



}
catch(error){


console.error(
"Unfollow Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// ===================================================
// Check Following
// GET /api/follows/check/:writerId
// ===================================================

exports.checkFollowing = async(req,res)=>{


try{


const {writerId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(writerId)
){

return res.status(400).json({

success:false,

message:"Invalid Writer ID"

});

}





const follow =
await Follow.findOne({

follower:req.user._id,

following:writerId

});






return res.status(200).json({

success:true,

following:Boolean(follow)

});



}
catch(error){


console.error(
"Check Following Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// ===================================================
// Get Followers Of Writer
// GET /api/follows/followers/:writerId
// ===================================================

exports.getFollowers = async(req,res)=>{


try{


const {writerId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(writerId)
){

return res.status(400).json({

success:false,

message:"Invalid Writer ID"

});

}





const writer =
await User.findById(writerId);



if(!writer){

return res.status(404).json({

success:false,

message:"User not found"

});

}






const followers =
await Follow.find({

following:writerId

})

.populate({

path:"follower",

select:"username avatar bio"

})

.sort({

createdAt:-1

});






return res.status(200).json({

success:true,

count:followers.length,

followers

});



}
catch(error){


console.error(
"Get Followers Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// ===================================================
// Get My Following
// GET /api/follows/following
// ===================================================

exports.getMyFollowing = async(req,res)=>{


try{


const following =
await Follow.find({

follower:req.user._id

})

.populate({

path:"following",

select:"username avatar bio"

})

.sort({

createdAt:-1

});






return res.status(200).json({

success:true,

count:following.length,

following

});



}
catch(error){


console.error(
"Get Following Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}


};









// ===================================================
// Get Follow Count
// GET /api/follows/count/:writerId
// ===================================================

exports.getFollowCount = async(req,res)=>{


try{


const {writerId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(writerId)
){

return res.status(400).json({

success:false,

message:"Invalid Writer ID"

});

}





const followers =
await Follow.countDocuments({

following:writerId

});





const following =
await Follow.countDocuments({

follower:writerId

});






return res.status(200).json({

success:true,

followers,

following

});



}
catch(error){


console.error(
"Get Follow Count Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}


};





module.exports = {

followWriter:exports.followWriter,

unfollowWriter:exports.unfollowWriter,

checkFollowing:exports.checkFollowing,

getFollowers:exports.getFollowers,

getMyFollowing:exports.getMyFollowing,

getFollowCount:exports.getFollowCount,

};