const jwt = require("jsonwebtoken");
const User = require("../models/User");



// ======================================
// Protect Middleware
// ======================================

const protect = async (req, res, next) => {


try {


let token;



// Check Authorization Header

if(

req.headers.authorization &&

req.headers.authorization.startsWith("Bearer ")

){


token =
req.headers.authorization.split(" ")[1];


}
else{


return res.status(401).json({

success:false,

message:"No token provided"

});


}




// Verify Token

const decoded =
jwt.verify(

token,

process.env.JWT_SECRET

);





// Find User

const user =
await User.findById(decoded.id)
.select("-password");




if(!user){


return res.status(401).json({

success:false,

message:"User not found"

});


}





// Account Status

if(!user.isActive){


return res.status(403).json({

success:false,

message:"Account is disabled"

});


}





// Attach User

req.user = user;



next();



}
catch(error){


console.error(

"Protect Middleware Error:",

error.message

);




if(
error.name === "TokenExpiredError"
){


return res.status(401).json({

success:false,

message:"Session expired. Please login again."

});


}





if(
error.name === "JsonWebTokenError"
){


return res.status(401).json({

success:false,

message:"Invalid token"

});


}





return res.status(401).json({

success:false,

message:"Not authorized"

});


}


};







// ======================================
// Role Authorization Middleware
// ======================================


const authorize = (...roles) => {


return(req,res,next)=>{


if(!req.user){


return res.status(401).json({

success:false,

message:"Authentication required"

});


}





if(!roles.includes(req.user.role)){


return res.status(403).json({

success:false,

message:
"You don't have permission for this action"

});


}





next();


};


};





module.exports = {

protect,

authorize

};