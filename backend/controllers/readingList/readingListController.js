const mongoose = require("mongoose");

const ReadingList = require("../../models/ReadingList");
const ReadingListItem = require("../../models/ReadingListItem");
const Story = require("../../models/Story");



// ===================================================
// Create Reading List
// POST /api/reading-lists
// ===================================================

exports.createReadingList = async (req, res) => {

try {


const {
name,
description,
visibility
} = req.body;



if(!name || name.trim()===""){

return res.status(400).json({

success:false,

message:"Reading list name is required"

});

}





const existingList =
await ReadingList.findOne({

user:req.user._id,

name:name.trim()

});




if(existingList){

return res.status(409).json({

success:false,

message:"Reading list already exists"

});

}





const readingList =
await ReadingList.create({

user:req.user._id,

name:name.trim(),

description,

visibility:
visibility || "private"

});





return res.status(201).json({

success:true,

message:"Reading list created successfully",

readingList

});



}
catch(error){

console.error(
"Create Reading List Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Get My Reading Lists
// GET /api/reading-lists
// ===================================================

exports.getMyReadingLists = async(req,res)=>{

try{


const readingLists =
await ReadingList.find({

user:req.user._id

})
.sort({

createdAt:-1

});





return res.status(200).json({

success:true,

count:readingLists.length,

readingLists

});



}
catch(error){

console.error(
"Get Reading Lists Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Get Single Reading List
// GET /api/reading-lists/:listId
// ===================================================

exports.getReadingListById = async(req,res)=>{

try{


const {listId}=req.params;



if(
!mongoose.Types.ObjectId.isValid(listId)
){

return res.status(400).json({

success:false,

message:"Invalid Reading List ID"

});

}




const readingList =
await ReadingList.findOne({

_id:listId,

user:req.user._id

});





if(!readingList){

return res.status(404).json({

success:false,

message:"Reading list not found"

});

}





const stories =
await ReadingListItem.find({

readingList:listId

})
.populate({

path:"story",

populate:{

path:"author",

select:"username avatar"

}

})
.sort({

order:1

});





return res.status(200).json({

success:true,

readingList,

stories

});



}
catch(error){

console.error(
"Get Reading List Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Update Reading List
// PUT /api/reading-lists/:listId
// ===================================================

exports.updateReadingList = async(req,res)=>{

try{


const {listId}=req.params;

const {
name,
description,
visibility
}=req.body;




if(
!mongoose.Types.ObjectId.isValid(listId)
){

return res.status(400).json({

success:false,

message:"Invalid Reading List ID"

});

}





const readingList =
await ReadingList.findOne({

_id:listId,

user:req.user._id

});





if(!readingList){

return res.status(404).json({

success:false,

message:"Reading list not found"

});

}





// Duplicate name check

if(
name &&
name.trim() !== readingList.name
){


const exists =
await ReadingList.findOne({

user:req.user._id,

name:name.trim()

});



if(exists){

return res.status(409).json({

success:false,

message:"Reading list already exists"

});

}



readingList.name =
name.trim();

}





if(description !== undefined){

readingList.description =
description;

}



if(visibility){

readingList.visibility =
visibility;

}





await readingList.save();





return res.status(200).json({

success:true,

message:"Reading list updated successfully",

readingList

});



}
catch(error){

console.error(
"Update Reading List Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Delete Reading List
// DELETE /api/reading-lists/:listId
// ===================================================

exports.deleteReadingList = async(req,res)=>{

try{


const {listId}=req.params;



const readingList =
await ReadingList.findOne({

_id:listId,

user:req.user._id

});




if(!readingList){

return res.status(404).json({

success:false,

message:"Reading list not found"

});

}





await ReadingListItem.deleteMany({

readingList:listId

});



await readingList.deleteOne();





return res.status(200).json({

success:true,

message:"Reading list deleted successfully"

});



}
catch(error){

console.error(
"Delete Reading List Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Add Story To Reading List
// POST /api/reading-lists/:listId/stories/:storyId
// ===================================================

exports.addStoryToReadingList = async(req,res)=>{

try{


const {
listId,
storyId
}=req.params;



if(
!mongoose.Types.ObjectId.isValid(listId)
||
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid ID"

});

}





const readingList =
await ReadingList.findOne({

_id:listId,

user:req.user._id

});





if(!readingList){

return res.status(404).json({

success:false,

message:"Reading list not found"

});

}





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





const exists =
await ReadingListItem.findOne({

readingList:listId,

story:storyId

});





if(exists){

return res.status(409).json({

success:false,

message:"Story already exists in this reading list"

});

}





const count =
await ReadingListItem.countDocuments({

readingList:listId

});





const item =
await ReadingListItem.create({

readingList:listId,

story:storyId,

order:count + 1

});





return res.status(201).json({

success:true,

message:"Story added successfully",

item

});



}
catch(error){

console.error(
"Add Story Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// Remove Story From Reading List
// DELETE /api/reading-lists/:listId/stories/:storyId
// ===================================================

exports.removeStoryFromReadingList = async(req,res)=>{

try{


const {
listId,
storyId
}=req.params;




const readingList =
await ReadingList.findOne({

_id:listId,

user:req.user._id

});





if(!readingList){

return res.status(404).json({

success:false,

message:"Reading list not found"

});

}





const item =
await ReadingListItem.findOneAndDelete({

readingList:listId,

story:storyId

});





if(!item){

return res.status(404).json({

success:false,

message:"Story not found in this reading list"

});

}





// Reorder remaining stories

const remaining =
await ReadingListItem.find({

readingList:listId

})
.sort({

order:1

});




for(let i=0;i<remaining.length;i++){

remaining[i].order = i + 1;

await remaining[i].save();

}





return res.status(200).json({

success:true,

message:"Story removed successfully"

});



}
catch(error){

console.error(
"Remove Story Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};