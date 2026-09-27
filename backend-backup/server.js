// ======================================
// Environment Config
// ======================================

const dotenv = require("dotenv");

dotenv.config();



// ======================================
// Imports
// ======================================

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const cloudinary = require("./config/cloudinary");



// Routes

const storyRoutes =
require("./routes/storyRoutes");

const chapterRoutes =
require("./routes/chapterRoutes");

const uploadRoutes =
require("./routes/uploadRoutes");

const authRoutes =
require("./routes/authRoutes");

const homeRoutes =
require("./routes/homeRoutes");

const bookmarkRoutes =
require("./routes/bookmarkRoutes");

const readingHistoryRoutes =
require("./routes/readingHistoryRoutes");

const readingListRoutes =
require("./routes/readingListRoutes");

const commentRoutes =
require("./routes/commentRoutes");

const reviewRoutes =
require("./routes/reviewRoutes");

const followRoutes =
require("./routes/followRoutes");

const notificationRoutes =
require("./routes/notificationRoutes");

const searchRoutes =
require("./routes/searchRoutes");

const profileRoutes =
require("./routes/profileRoutes");

const analyticsRoutes =
require("./routes/analyticsRoutes");

const recommendationRoutes =
require("./routes/recommendationRoutes");




// ======================================
// Express App
// ======================================

const app = express();





// ======================================
// Middleware
// ======================================


app.use(
cors()
);



app.use(
express.json({

limit:"50mb"

})
);



app.use(
express.urlencoded({

extended:true,

limit:"50mb"

})
);






// ======================================
// API Routes
// ======================================


app.use(
"/api/stories",
storyRoutes
);


app.use(
"/api/chapters",
chapterRoutes
);


app.use(
"/api/upload",
uploadRoutes
);


app.use(
"/api/auth",
authRoutes
);


app.use(
"/api/home",
homeRoutes
);


app.use(
"/api/bookmarks",
bookmarkRoutes
);


app.use(
"/api/history",
readingHistoryRoutes
);


app.use(
"/api/reading-lists",
readingListRoutes
);


app.use(
"/api/comments",
commentRoutes
);


app.use(
"/api/reviews",
reviewRoutes
);


app.use(
"/api/follows",
followRoutes
);


app.use(
"/api/notifications",
notificationRoutes
);


app.use(
"/api/search",
searchRoutes
);


app.use(
"/api/profile",
profileRoutes
);


app.use(
"/api/analytics",
analyticsRoutes
);


app.use(
"/api/recommendations",
recommendationRoutes
);






// ======================================
// Default Route
// ======================================


app.get("/", (req,res)=>{

res.status(200).json({

success:true,

message:"Lumora API is running"

});

});






// ======================================
// Cloudinary Test
// ======================================


app.get(
"/cloud-test",
async(req,res)=>{


try{


const result =
await cloudinary.api.ping();


res.json(result);


}
catch(error){


console.error(error);


res.status(500).json({

success:false,

message:error.message

});


}


}

);






// ======================================
// Upload Test
// ======================================


app.get(
"/upload-test",
async(req,res)=>{


try{


const result =
await cloudinary.uploader.upload(

"https://res.cloudinary.com/demo/image/upload/sample.jpg"

);



res.json(result);



}
catch(error){


console.error(error);


res.status(500).json(error);


}


}

);







// ======================================
// Error Handler
// ======================================


app.use(

(err,req,res,next)=>{


console.error(err);


res.status(500).json({

success:false,

message:"Server Error"

});


}

);






// ======================================
// Start Server
// ======================================


const PORT =
process.env.PORT || 5000;




const startServer = async()=>{


try{


await connectDB();



app.listen(
PORT,
()=>{


console.log(

`Server Running on Port ${PORT}`

);


}

);



}
catch(error){


console.error(

"Failed to start server:",

error

);



process.exit(1);


}


};




startServer();