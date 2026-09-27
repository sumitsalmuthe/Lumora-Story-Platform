const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema(

{

story: {

type: mongoose.Schema.Types.ObjectId,

ref:"Story",

required:true,

},


user: {

type: mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,

},


rating: {

type:Number,

required:true,

min:1,

max:5,

},


review: {

type:String,

trim:true,

maxlength:1000,

default:"",

},


likes:[

{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

}

],


isEdited:{

type:Boolean,

default:false,

},


isDeleted:{

type:Boolean,

default:false,

},


},

{

timestamps:true,

}

);



// One user can review one story only

reviewSchema.index(

{

story:1,

user:1,

},

{

unique:true,

}

);



module.exports = mongoose.model(

"Review",

reviewSchema

);