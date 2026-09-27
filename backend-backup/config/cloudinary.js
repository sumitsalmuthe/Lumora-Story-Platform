const cloudinary = require("cloudinary").v2;


cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,

    api_key: process.env.API_KEY,

    api_secret: process.env.API_SECRET,

});



// Test Connection

cloudinary.api.ping()

.then(()=>{

    console.log(
        "Cloudinary Connected"
    );

})

.catch((error)=>{

    console.error(
        "Cloudinary Error:",
        error.message
    );

});



module.exports = cloudinary;