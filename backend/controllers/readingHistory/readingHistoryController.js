const mongoose = require("mongoose");

const ReadingHistory = require("../../models/ReadingHistory");
const Story = require("../../models/Story");
const Chapter = require("../../models/Chapter");



// ===============================================
// Update Reading History
// POST /api/history/:storyId
// ===============================================

exports.updateReadingHistory = async (req, res) => {

try {


const { storyId } = req.params;

const { lastChapter } = req.body;



// Validate Story ID

if(
!mongoose.Types.ObjectId.isValid(storyId)
){

return res.status(400).json({

success:false,

message:"Invalid Story ID"

});

}




const story =
await Story.findById(storyId);



if(!story){

return res.status(404).json({

success:false,

message:"Story not found"

});

}






// Total Published Chapters

const totalChapters =
await Chapter.countDocuments({

story:storyId,

status:"published"

});





let progress = 0;

let completed = false;





if(lastChapter){



if(
!mongoose.Types.ObjectId.isValid(lastChapter)
){

return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});

}




const currentChapter =
await Chapter.findById(lastChapter);





if(!currentChapter){

return res.status(404).json({

success:false,

message:"Chapter not found"

});

}





// Check chapter belongs to story

if(

currentChapter.story.toString()
!==
storyId.toString()

){

return res.status(400).json({

success:false,

message:
"Chapter does not belong to this story"

});

}





// Avoid divide by zero

if(totalChapters > 0){


progress = Math.round(

(
currentChapter.chapterNumber /
totalChapters

) * 100

);


}





if(progress >= 100){

progress = 100;

completed = true;

}



}







const history =
await ReadingHistory.findOneAndUpdate(

{

user:req.user._id,

story:storyId

},

{

user:req.user._id,

story:storyId,

lastChapter:lastChapter || null,

progress,

completed,

lastReadAt:new Date()

},

{

new:true,

upsert:true,

runValidators:true

}

);






return res.status(200).json({

success:true,

message:
"Reading history updated successfully",

history

});



}
catch(error){


console.error(

"Update Reading History Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===============================================
// Get Reading History
// GET /api/history
// ===============================================

exports.getReadingHistory = async(req,res)=>{


try{


const history =

await ReadingHistory.find({

user:req.user._id

})

.populate({

path:"story",

select:
"title coverImage shortDescription author",

populate:{

path:"author",

select:
"username avatar"

}

})

.populate({

path:"lastChapter",

select:
"title chapterNumber"

})

.sort({

lastReadAt:-1

});






return res.status(200).json({

success:true,

count:history.length,

history

});



}
catch(error){


console.error(

"Get Reading History Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===============================================
// Clear Reading History
// DELETE /api/history
// ===============================================

exports.clearReadingHistory = async(req,res)=>{


try{


await ReadingHistory.deleteMany({

user:req.user._id

});





return res.status(200).json({

success:true,

message:
"Reading history cleared successfully"

});



}
catch(error){


console.error(

"Clear Reading History Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};