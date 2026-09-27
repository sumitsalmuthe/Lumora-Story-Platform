const mongoose = require("mongoose");

const User = require("../../models/User");
const Story = require("../../models/Story");
const Follow = require("../../models/Follow");
const Review = require("../../models/Review");



// ===================================================
// Get My Profile
// GET /api/profile/me
// ===================================================

exports.getMyProfile = async(req,res)=>{

try{


const user =
await User.findById(req.user._id)
.select("-password");



if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}





return res.status(200).json({

success:true,

profile:user

});


}
catch(error){


console.error(
"Get My Profile Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Update My Profile
// PUT /api/profile/me
// ===================================================

exports.updateMyProfile = async(req,res)=>{


try{


const {
username,
bio
}=req.body;




const user =
await User.findById(req.user._id);





if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}







// Username Update

if(
username &&
username.trim()
.toLowerCase()
!== user.username
){

const newUsername =
username
.trim()
.toLowerCase();





const usernameExists =
await User.findOne({

username:newUsername

});





if(usernameExists){

return res.status(400).json({

success:false,

message:"Username already taken"

});

}





user.username =
newUsername;


}








// Bio Update

if(bio !== undefined){



if(
bio.length > 500
){

return res.status(400).json({

success:false,

message:
"Bio cannot exceed 500 characters"

});

}




user.bio =
bio.trim();


}







await user.save();







return res.status(200).json({

success:true,

message:
"Profile updated successfully",

profile:{

_id:user._id,

username:user.username,

email:user.email,

avatar:user.avatar,

bio:user.bio,

role:user.role,

verified:user.verified

}

});


}
catch(error){


console.error(
"Update Profile Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Get Profile By ID
// GET /api/profile/id/:id
// ===================================================

exports.getProfileById = async(req,res)=>{


try{


const {
id
}=req.params;




if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

success:false,

message:"Invalid User ID"

});

}





const user =
await User.findById(id)
.select("-password");





if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}





return res.status(200).json({

success:true,

profile:user

});


}
catch(error){


console.error(
"Get Profile By ID Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Get Profile By Username
// GET /api/profile/username/:username
// ===================================================

exports.getProfileByUsername = async(req,res)=>{


try{


const {
username
}=req.params;




const user =
await User.findOne({

username:
username.toLowerCase()

})
.select("-password");





if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}





return res.status(200).json({

success:true,

profile:user

});


}
catch(error){


console.error(
"Get Profile Username Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Update Avatar
// PUT /api/profile/avatar
// ===================================================

exports.updateAvatar = async(req,res)=>{


try{


const {
avatar
}=req.body;





if(!avatar){

return res.status(400).json({

success:false,

message:"Avatar is required"

});

}





if(
!avatar.startsWith("http")
){

return res.status(400).json({

success:false,

message:"Invalid avatar URL"

});

}






const user =
await User.findById(req.user._id);





if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}





user.avatar =
avatar;



await user.save();







return res.status(200).json({

success:true,

message:
"Avatar updated successfully",

avatar:user.avatar

});


}
catch(error){


console.error(
"Update Avatar Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Writer Statistics
// GET /api/profile/:id/stats
// ===================================================

exports.getWriterStats = async(req,res)=>{


try{


const {
id
}=req.params;





if(
!mongoose.Types.ObjectId.isValid(id)
){

return res.status(400).json({

success:false,

message:"Invalid User ID"

});

}





const writer =
await User.findById(id);





if(!writer){

return res.status(404).json({

success:false,

message:"Writer not found"

});

}





if(
writer.role !== "writer"
){

return res.status(400).json({

success:false,

message:"User is not a writer"

});

}







const stories =
await Story.find({

author:id,

status:"Published",

visibility:"Public"

})
.select("_id");







const totalStories =
stories.length;







const totalFollowers =
await Follow.countDocuments({

following:id

});







const reviews =
await Review.find({

story:{

$in:
stories.map(
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








return res.status(200).json({

success:true,

stats:{

totalStories,

totalFollowers,

totalReviews,

averageRating

}

});


}
catch(error){


console.error(
"Get Writer Stats Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Get All Writers
// GET /api/profile/writers
// ===================================================

exports.getAllWriters = async(req,res)=>{


try{


const writers =
await User.find({

role:"writer",

isActive:true

})

.select(
"username avatar bio verified createdAt"
)

.sort({

createdAt:-1

});






return res.status(200).json({

success:true,

count:writers.length,

writers

});


}
catch(error){


console.error(
"Get All Writers Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};