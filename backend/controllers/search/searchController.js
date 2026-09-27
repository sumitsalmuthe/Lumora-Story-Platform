const Story = require("../../models/Story");
const User = require("../../models/User");



// ===================================================
// Escape Regex
// ===================================================

const escapeRegex = (text) => {

return text.replace(
/[.*+?^${}()|[\]\\]/g,
"\\$&"
);

};




// ===================================================
// Pagination Helper
// ===================================================

const pagination = (req)=>{

const page =
Math.max(
Number(req.query.page) || 1,
1
);


const limit =
Math.min(
Number(req.query.limit) || 10,
50
);



return {

page,

limit,

skip:(page-1)*limit

};

};









// ===================================================
// Global Search
// GET /api/search?q=keyword
// ===================================================

exports.globalSearch = async(req,res)=>{

try{


const {q}=req.query;


if(!q || q.trim()===""){

return res.status(400).json({

success:false,

message:"Search keyword is required"

});

}





const keyword =
escapeRegex(q.trim());



const {
skip,
limit,
page
}=pagination(req);






const storyQuery = {

status:"Published",

visibility:"Public",

$or:[

{
title:{
$regex:keyword,
$options:"i"
}
},

{
subtitle:{
$regex:keyword,
$options:"i"
}
},

{
shortDescription:{
$regex:keyword,
$options:"i"
}
},

{
category:{
$regex:keyword,
$options:"i"
}
},

{
tags:{
$in:[
new RegExp(keyword,"i")
]
}
}

]

};







const userQuery = {

role:"writer",

$or:[

{
username:{
$regex:keyword,
$options:"i"
}
},

{
bio:{
$regex:keyword,
$options:"i"
}
}

]

};








const stories =
await Story.find(storyQuery)

.populate({

path:"author",

select:"username avatar"

})

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);






const writers =
await User.find(userQuery)

.select(
"username avatar bio role createdAt"
)

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);








return res.status(200).json({

success:true,

keyword:q.trim(),

page,

limit,

storiesCount:stories.length,

writersCount:writers.length,

stories,

writers

});



}
catch(error){


console.error(

"Global Search Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Search Stories
// GET /api/search/stories?q=keyword
// ===================================================

exports.searchStories = async(req,res)=>{


try{


const {q}=req.query;



if(!q || q.trim()===""){

return res.status(400).json({

success:false,

message:"Search keyword is required"

});

}





const keyword =
escapeRegex(q.trim());



const {
skip,
limit,
page
}=pagination(req);







const stories =
await Story.find({

status:"Published",

visibility:"Public",

$or:[

{
title:{
$regex:keyword,
$options:"i"
}
},

{
subtitle:{
$regex:keyword,
$options:"i"
}
},

{
shortDescription:{
$regex:keyword,
$options:"i"
}
},

{
category:{
$regex:keyword,
$options:"i"
}
},

{
tags:{
$in:[
new RegExp(keyword,"i")
]
}
}

]

})

.populate({

path:"author",

select:"username avatar"

})

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);








return res.status(200).json({

success:true,

keyword:q.trim(),

page,

limit,

count:stories.length,

stories

});



}
catch(error){


console.error(

"Search Stories Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Search Writers
// GET /api/search/users?q=keyword
// ===================================================

exports.searchUsers = async(req,res)=>{


try{


const {q}=req.query;



if(!q || q.trim()===""){

return res.status(400).json({

success:false,

message:"Search keyword is required"

});

}





const keyword =
escapeRegex(q.trim());



const {
skip,
limit,
page
}=pagination(req);








const writers =
await User.find({

role:"writer",

$or:[

{
username:{
$regex:keyword,
$options:"i"
}
},

{
bio:{
$regex:keyword,
$options:"i"
}
}

]

})

.select(
"username avatar bio role createdAt"
)

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);








return res.status(200).json({

success:true,

keyword:q.trim(),

page,

limit,

count:writers.length,

writers

});



}
catch(error){


console.error(

"Search Writers Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};









// ===================================================
// Search Tags
// GET /api/search/tags?q=keyword
// ===================================================

exports.searchTags = async(req,res)=>{


try{


const {q}=req.query;



if(!q || q.trim()===""){

return res.status(400).json({

success:false,

message:"Search keyword is required"

});

}





const keyword =
escapeRegex(q.trim());



const {
skip,
limit,
page
}=pagination(req);








const stories =
await Story.find({

status:"Published",

visibility:"Public",

tags:{
$in:[
new RegExp(keyword,"i")
]
}

})

.populate({

path:"author",

select:"username avatar"

})

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit);







return res.status(200).json({

success:true,

keyword:q.trim(),

page,

limit,

count:stories.length,

stories

});



}
catch(error){


console.error(

"Search Tags Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}

};