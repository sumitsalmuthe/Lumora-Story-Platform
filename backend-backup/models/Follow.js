const mongoose = require("mongoose");



const followSchema = new mongoose.Schema(

{

// ======================================
// User who follows
// ======================================

follower: {

type: mongoose.Schema.Types.ObjectId,

ref: "User",

required: true,

index: true,

},



// ======================================
// User being followed
// ======================================

following: {

type: mongoose.Schema.Types.ObjectId,

ref: "User",

required: true,

index: true,

},


},

{

timestamps:true

}

);





// ======================================
// Prevent Duplicate Follow
// ======================================

followSchema.index(

{

follower:1,

following:1,

},

{

unique:true,

}

);





// ======================================
// Followers Lookup
// ======================================

followSchema.index(

{

following:1,

createdAt:-1,

}

);





// ======================================
// Following Lookup
// ======================================

followSchema.index(

{

follower:1,

createdAt:-1,

}

);





// ======================================
// Prevent User Following Himself
// ======================================

followSchema.pre(
"save",
function(next){


if(
this.follower.toString()
===
this.following.toString()
){

return next(
new Error(
"You cannot follow yourself"
)
);

}


next();


}
);





module.exports = mongoose.model(

"Follow",

followSchema

);