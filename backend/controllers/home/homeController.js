const Story = require("../../models/Story");
const ReadingHistory = require("../../models/ReadingHistory");



// ===================================================
// GET HOME DATA
// GET /api/home
// ===================================================

const getHomeData = async (req, res) => {

try {



const [trending, latest] = await Promise.all([



// ===============================
// Trending Stories
// ===============================

Story.find({

status:"Published",

visibility:"Public",

})

.populate({

path:"author",

select:"username avatar"

})

.sort({

views:-1,

likes:-1,

comments:-1,

createdAt:-1

})

.limit(8),





// ===============================
// Latest Stories
// ===============================

Story.find({

status:"Published",

visibility:"Public",

})

.populate({

path:"author",

select:"username avatar"

})

.sort({

createdAt:-1

})

.limit(8)



]);







// ===============================
// Continue Reading
// ===============================

let continueReading = [];




if(req.user){



const history =

await ReadingHistory.find({

user:req.user._id

})

.populate({

path:"story",

populate:{

path:"author",

select:"username avatar"

}

})

.populate({

path:"lastChapter",

select:"title chapterNumber"

})

.sort({

lastReadAt:-1

})

.limit(8);






continueReading = history

.filter(

(item)=>item.story

)

.map((item)=>{


return {


...item.story.toObject(),


lastChapter:
item.lastChapter,


progress:
item.progress || 0,


completed:
item.completed || false


};


});



}






return res.status(200).json({

success:true,


trending,


latest,


continueReading



});




}
catch(error){



console.error(

"========== HOME API ERROR =========="

);


console.error(error);



console.error(

"===================================="

);




return res.status(500).json({

success:false,

message:"Server Error"

});



}

};





module.exports = {

getHomeData,

};