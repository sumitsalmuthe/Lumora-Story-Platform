const mongoose = require("mongoose");

const Bookmark = require("../../models/Bookmark");
const Story = require("../../models/Story");



// ==============================
// Add Bookmark
// POST /api/bookmarks/:storyId
// ==============================

exports.addBookmark = async (req, res) => {

try {


const { storyId } = req.params;



if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}




const story = await Story.findOne({

_id: storyId,

status:"Published",

visibility:"Public"

});



if(!story){

return res.status(404).json({

success:false,

message:"Story not found"

});

}





const existingBookmark =
await Bookmark.findOne({

user:req.user._id,

story:storyId

});





if(existingBookmark){

return res.status(409).json({

success:false,

message:"Story already bookmarked"

});

}





const bookmark =
await Bookmark.create({

user:req.user._id,

story:storyId

});





await Story.findByIdAndUpdate(

storyId,

{

$inc:{

bookmarks:1

}

}

);






return res.status(201).json({

success:true,

message:"Story bookmarked successfully",

bookmark

});



}
catch(error){



console.error(

"Add Bookmark Error:",

error

);



// Duplicate key error handling

if(error.code === 11000){

return res.status(409).json({

success:false,

message:"Story already bookmarked"

});

}





return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ==============================
// Remove Bookmark
// DELETE /api/bookmarks/:storyId
// ==============================

exports.removeBookmark = async(req,res)=>{


try{


const {storyId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}





const bookmark =
await Bookmark.findOneAndDelete({

user:req.user._id,

story:storyId

});





if(!bookmark){


return res.status(404).json({

success:false,

message:"Bookmark not found"

});


}






await Story.findByIdAndUpdate(

storyId,

{

$inc:{

bookmarks:-1

}

}

);






// Prevent negative count

await Story.updateOne(

{

_id:storyId,

bookmarks:{
$lt:0
}

},

{

$set:{

bookmarks:0

}

}

);







return res.status(200).json({

success:true,

message:"Bookmark removed successfully"

});


}
catch(error){


console.error(

"Remove Bookmark Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ==============================
// Get My Bookmarks
// GET /api/bookmarks
// ==============================

exports.getBookmarks = async(req,res)=>{


try{


const bookmarks =

await Bookmark.find({

user:req.user._id

})

.populate({

path:"story",

populate:{

path:"author",

select:"username avatar"

}

})

.sort({

createdAt:-1

});





return res.status(200).json({

success:true,

count:bookmarks.length,

bookmarks

});


}
catch(error){


console.error(

"Get Bookmarks Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ==============================
// Check Bookmark
// GET /api/bookmarks/check/:storyId
// ==============================

exports.checkBookmark = async(req,res)=>{


try{


const {storyId}=req.params;




if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}





const bookmark =
await Bookmark.findOne({

user:req.user._id,

story:storyId

});






return res.status(200).json({

success:true,

bookmarked:Boolean(bookmark)

});


}
catch(error){


console.error(

"Check Bookmark Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};