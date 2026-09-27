const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const userSchema = new mongoose.Schema(
{

username: {

type:String,

required:true,

trim:true,

unique:true,

lowercase:true,

},



email: {

type:String,

required:true,

unique:true,

lowercase:true,

trim:true,

},



password: {

type:String,

required:true,

},



avatar: {

type:String,

default:"",

},



bio: {

type:String,

default:"",

maxlength:500,

},




role: {

type:String,

enum:[

"reader",

"writer",

"admin"

],

default:"reader",

},




verified: {

type:Boolean,

default:false,

},




isActive: {

type:Boolean,

default:true,

},





// ==========================
// Writer Profile
// ==========================


writerProfile:{


penName:{

type:String,

default:"",

},



joinedAsWriter:{

type:Date,

default:null,

}


},





// ==========================
// Last Login
// ==========================


lastLogin:{

type:Date,

default:null,

}



},

{

timestamps:true

}

);









// ==========================
// Password Hash
// ==========================


userSchema.pre(
"save",
async function(){




// Password already hashed

if(
!this.isModified("password")
){

return;

}






const salt =
await bcrypt.genSalt(10);





this.password =

await bcrypt.hash(

this.password,

salt

);



}

);









// ==========================
// Compare Password
// ==========================


userSchema.methods.matchPassword =

async function(password){


return await bcrypt.compare(

password,

this.password

);


};








module.exports =
mongoose.model(

"User",

userSchema

);