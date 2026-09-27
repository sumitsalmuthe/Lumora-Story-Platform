const mongoose = require("mongoose");


const storySchema = new mongoose.Schema(
{

// ==============================
// Basic Info
// ==============================

title: {

  type: String,

  required: true,

  trim: true,

},


subtitle: {

  type: String,

  default: "",

  trim: true,

},


shortDescription: {

  type: String,

  required: true,

  trim: true,

},


coverImage: {

  type: String,

  default: "",

},



// ==============================
// Story Details
// ==============================


category: {

  type: String,

  required: true,

},


language: {

  type: String,

  default: "English",

},


storyType: {

  type: String,

  enum: [
    "Fiction",
    "Fanfic",
    "Nonfiction",
    "Poetry"
  ],

  default: "Fiction",

},


tags: [

  {

    type: String,

  }

],


copyright: {

  type: String,

  default: "All Rights Reserved",

},


targetAudience: {

  type: String,

  default: "Everyone",

},


mature: {

  type: Boolean,

  default: false,

},



// ==============================
// Publishing
// ==============================


status: {

  type: String,

  enum: [
    "Draft",
    "Published",
    "Completed"
  ],

  default: "Draft",

},


visibility: {

  type: String,

  enum: [
    "Public",
    "Private"
  ],

  default: "Public",

},



// ==============================
// Author
// ==============================


author: {

  type: mongoose.Schema.Types.ObjectId,

  ref: "User",

  required: true,

},



// ==============================
// Statistics
// ==============================


views: {

  type: Number,

  default: 0,

},


// Users who liked story

likes: [

  {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

  }

],



bookmarks: {

  type: Number,

  default: 0,

},



comments: {

  type: Number,

  default: 0,

},


},

{

timestamps:true,

}

);



module.exports = mongoose.model(
"Story",
storySchema
);