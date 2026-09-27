const uploadService =
require("../../services/uploadService");





// ======================================
// Upload Image
// POST /api/upload
// ======================================


exports.uploadImage = async(req,res)=>{


try{


if(!req.file){


return res.status(400).json({

success:false,

message:
"No image selected"

});


}




const result =

await uploadService.uploadImage(

req.file

);






return res.status(200).json({

success:true,

message:
"Image uploaded successfully",


url:
result.url,


publicId:
result.publicId


});



}
catch(error){


console.error(

"Upload Controller Error:",

error.message

);




return res.status(500).json({

success:false,

message:
"Image upload failed"

});


}



};