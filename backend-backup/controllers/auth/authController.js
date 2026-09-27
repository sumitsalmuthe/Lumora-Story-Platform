const User = require("../../models/User");
const generateToken = require("../../utils/generateToken");



// ======================================
// Register User
// ======================================

const registerUser = async(req,res)=>{


try{


const {
username,
email,
password
}=req.body;



if(
!username ||
!email ||
!password
){

return res.status(400).json({

success:false,

message:"Please fill all fields"

});

}



if(password.length < 8){


return res.status(400).json({

success:false,

message:"Password must be at least 8 characters"

});

}



const normalizedEmail =
email.toLowerCase().trim();




// Check Existing User

const userExists =
await User.findOne({

$or:[

{
email:normalizedEmail
},

{
username:username.trim()
}

]

});



if(userExists){


return res.status(400).json({

success:false,

message:"Email or username already registered"

});

}





const user =
await User.create({

username:username.trim(),

email:normalizedEmail,

password,

});





return res.status(201).json({

success:true,

message:"Account created successfully",


user:{

_id:user._id,

username:user.username,

email:user.email,

avatar:user.avatar,

bio:user.bio,

role:user.role,

verified:user.verified,

writerProfile:user.writerProfile,

},


token:
generateToken(user._id)


});



}
catch(error){


console.error(
"Register Error:",
error
);


return res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Login User
// ======================================


const loginUser = async(req,res)=>{


try{


const {
email,
password
}=req.body;



if(
!email ||
!password
){

return res.status(400).json({

success:false,

message:"Email and password are required"

});

}




const normalizedEmail =
email.toLowerCase().trim();




const user =
await User.findOne({

email:normalizedEmail

});





if(
user &&
await user.matchPassword(password)
){



if(!user.isActive){


return res.status(403).json({

success:false,

message:"Account disabled"

});


}





user.lastLogin =
new Date();


await user.save();





return res.json({

success:true,


user:{

_id:user._id,

username:user.username,

email:user.email,

avatar:user.avatar,

bio:user.bio,

role:user.role,

verified:user.verified,

writerProfile:user.writerProfile,

},


token:
generateToken(user._id)


});



}





return res.status(401).json({

success:false,

message:"Invalid email or password"

});



}
catch(error){


console.error(
"Login Error:",
error
);


return res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Become Writer
// PUT /api/auth/become-writer
// ======================================


const becomeWriter = async(req,res)=>{


try{


const user =
await User.findById(
req.user._id
);



if(!user){


return res.status(404).json({

success:false,

message:"User not found"

});


}





if(user.role==="writer"){


return res.status(400).json({

success:false,

message:"Already a writer"

});


}





user.role="writer";



user.writerProfile={

penName:user.username,

joinedAsWriter:new Date()

};





await user.save();





return res.json({

success:true,

message:"Congratulations! You are now a Writer 🎉",


user:{

_id:user._id,

username:user.username,

email:user.email,

avatar:user.avatar,

bio:user.bio,

role:user.role,

verified:user.verified,

writerProfile:user.writerProfile,

},


token:
generateToken(user._id)


});



}
catch(error){


console.error(
"Become Writer Error:",
error
);


return res.status(500).json({

success:false,

message:error.message

});


}


};





module.exports={

registerUser,

loginUser,

becomeWriter

};