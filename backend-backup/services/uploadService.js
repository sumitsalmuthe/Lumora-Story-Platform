const cloudinary = require("../config/cloudinary");




// ======================================
// Upload Image To Cloudinary
// ======================================

exports.uploadImage = async(file)=>{


try{


if(!file){


throw new Error(
"No file provided"
);


}




const base64 =

`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;





const result =

await cloudinary.uploader.upload(

base64,

{

folder:"storyhub",

resource_type:"image"

}

);






return {

url:
result.secure_url,


publicId:
result.public_id


};



}
catch(error){


console.error(

"Upload Service Error:",

error.message

);



throw error;


}


};