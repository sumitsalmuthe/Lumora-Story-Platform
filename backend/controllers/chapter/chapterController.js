const mongoose = require("mongoose");

const Chapter = require("../../models/Chapter");
const Story = require("../../models/Story");



// ===================================================
// GET ALL CHAPTERS OF A STORY
// GET /api/chapters/story/:storyId
// ===================================================

const getChapters = async(req,res)=>{

try{

const {storyId}=req.params;


if(!mongoose.Types.ObjectId.isValid(storyId)){

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

message:"Story Not Found"

});

}




const chapters =
await Chapter.find({

story:storyId,

status:"published"

})
.sort({

chapterNumber:1

});





return res.status(200).json({

success:true,

count:chapters.length,

chapters

});


}
catch(error){

console.error(
"Get Chapters Error:",
error
);


return res.status(500).json({

success:false,

message:"Server Error"

});

}

};









// ===================================================
// GET SINGLE CHAPTER
// GET /api/chapters/:id
// ===================================================

const getChapterById = async(req,res)=>{

try{


const {id}=req.params;



if(!mongoose.Types.ObjectId.isValid(id)){


return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});


}





const chapter =
await Chapter.findById(id);



if(!chapter){


return res.status(404).json({

success:false,

message:"Chapter Not Found"

});


}





// Draft protection

if(
chapter.status === "draft" &&
(
!req.user ||
(
chapter.author &&
chapter.author.toString() !== req.user._id.toString()
)
)
){


return res.status(403).json({

success:false,

message:"This chapter is not published"

});


}




const story =
await Story.findById(
chapter.story
)
.populate(
"author",
"username avatar bio"
);





if(!story){


return res.status(404).json({

success:false,

message:"Story Not Found"

});


}





const previousChapter =
await Chapter.findOne({

story:chapter.story,

chapterNumber:
chapter.chapterNumber - 1,

status:"published"

});





const nextChapter =
await Chapter.findOne({

story:chapter.story,

chapterNumber:
chapter.chapterNumber + 1,

status:"published"

});





return res.status(200).json({

success:true,

chapter,

story,

previousChapter,

nextChapter

});



}
catch(error){


console.error(
"Get Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ===================================================
// CREATE CHAPTER
// POST /api/chapters
// ===================================================

const createChapter = async(req,res)=>{

try{


const {

story:storyId,

title

}=req.body;




if(!mongoose.Types.ObjectId.isValid(storyId)){


return res.status(400).json({

success:false,

message:"Invalid Story ID"

});


}





if(!title || title.trim()===""){


return res.status(400).json({

success:false,

message:"Chapter title is required"

});


}





const story =
await Story.findById(storyId);



if(!story){


return res.status(404).json({

success:false,

message:"Story Not Found"

});


}





// Owner Check

if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){


return res.status(403).json({

success:false,

message:"You are not allowed to add chapter"

});


}





// Find Last Chapter Number

const lastChapter =
await Chapter.findOne({

story:storyId

})
.sort({

chapterNumber:-1

});





const chapterNumber =
lastChapter
?
lastChapter.chapterNumber + 1
:
1;





const chapter =
await Chapter.create({

story:storyId,

chapterNumber,

title:title.trim(),

content:"",

wordCount:0,

status:"draft"

});





return res.status(201).json({

success:true,

message:"Chapter created successfully",

chapter

});



}
catch(error){


console.error(
"Create Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// UPDATE CHAPTER
// PUT /api/chapters/:id
// ===================================================

const updateChapter = async(req,res)=>{


try{


const {
id
}=req.params;




if(!mongoose.Types.ObjectId.isValid(id)){


return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});


}





const chapter =
await Chapter.findById(id);





if(!chapter){


return res.status(404).json({

success:false,

message:"Chapter Not Found"

});


}





const story =
await Story.findById(
chapter.story
);





if(!story){


return res.status(404).json({

success:false,

message:"Story Not Found"

});


}





// Permission Check

if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){


return res.status(403).json({

success:false,

message:"You are not allowed to update this chapter"

});


}





const updateData = {
...req.body
};





// Fix Word Count

if(req.body.content !== undefined){


updateData.wordCount =

req.body.content.trim()

?

req.body.content
.trim()
.split(/\s+/)
.length

:

0;


}





const updatedChapter =

await Chapter.findByIdAndUpdate(

id,

updateData,

{

new:true,

runValidators:true

}

);





return res.status(200).json({

success:true,

message:"Chapter updated successfully",

chapter:updatedChapter

});



}
catch(error){


console.error(
"Update Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};

// ===================================================
// DELETE CHAPTER
// DELETE /api/chapters/:id
// ===================================================

const deleteChapter = async(req,res)=>{


try{


const {
id
}=req.params;




if(!mongoose.Types.ObjectId.isValid(id)){


return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});


}





const chapter =
await Chapter.findById(id);





if(!chapter){


return res.status(404).json({

success:false,

message:"Chapter Not Found"

});


}





const story =
await Story.findById(
chapter.story
);





if(!story){


return res.status(404).json({

success:false,

message:"Story Not Found"

});


}





// Permission Check

if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){


return res.status(403).json({

success:false,

message:"You are not allowed to delete this chapter"

});


}





await chapter.deleteOne();





return res.status(200).json({

success:true,

message:"Chapter deleted successfully"

});



}
catch(error){


console.error(
"Delete Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// PUBLISH CHAPTER
// PUT /api/chapters/:id/publish
// ===================================================

const publishChapter = async(req,res)=>{


try{


const {
id
}=req.params;



if(!mongoose.Types.ObjectId.isValid(id)){


return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});


}





const chapter =
await Chapter.findById(id);





if(!chapter){


return res.status(404).json({

success:false,

message:"Chapter Not Found"

});


}





const story =
await Story.findById(
chapter.story
);





if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){


return res.status(403).json({

success:false,

message:"You are not allowed to publish this chapter"

});


}





chapter.status="published";

chapter.publishedAt =
new Date();



await chapter.save();





return res.status(200).json({

success:true,

message:"Chapter published successfully",

chapter

});


}
catch(error){


console.error(
"Publish Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// MOVE CHAPTER TO DRAFT
// PUT /api/chapters/:id/draft
// ===================================================

const moveChapterToDraft = async(req,res)=>{


try{


const {
id
}=req.params;



if(!mongoose.Types.ObjectId.isValid(id)){


return res.status(400).json({

success:false,

message:"Invalid Chapter ID"

});


}





const chapter =
await Chapter.findById(id);





if(!chapter){


return res.status(404).json({

success:false,

message:"Chapter Not Found"

});


}





const story =
await Story.findById(
chapter.story
);





if(

story.author.toString()
!==
req.user._id.toString()

&&

req.user.role !== "admin"

){


return res.status(403).json({

success:false,

message:"You are not allowed to update this chapter"

});


}





chapter.status="draft";


await chapter.save();





return res.status(200).json({

success:true,

message:"Chapter moved to draft successfully",

chapter

});


}
catch(error){


console.error(
"Draft Chapter Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









module.exports = {


getChapters,

getChapterById,

createChapter,

updateChapter,

deleteChapter,

publishChapter,

moveChapterToDraft


};