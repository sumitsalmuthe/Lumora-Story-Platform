const mongoose = require("mongoose");

const Comment = require("../../models/Comment");

// ======================================
// Like Comment
// POST /api/comments/:id/like
// ======================================

exports.likeComment = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID",
      });

    }


    const comment = await Comment.findById(id);

    if (!comment || comment.isDeleted) {

      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });

    }

    const alreadyLiked =
(comment.likes || []).some(

  (userId) =>
    userId.toString() ===
    req.user._id.toString()

);

    if (alreadyLiked) {

      return res.status(409).json({
        success: false,
        message: "Comment already liked",
      });

    }

if(!comment.likes){

  comment.likes = [];

}

comment.likes.push(req.user._id);
    await comment.save();

    return res.status(200).json({

      success: true,

      message: "Comment liked successfully",

      totalLikes: comment.likes.length,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// ======================================
// Remove Like
// DELETE /api/comments/:id/like
// ======================================

exports.removeLike = async (req, res) => {

  try {

    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        success:false,

        message:"Invalid Comment ID"

      });

    }


    const comment = await Comment.findById(id);


    if (!comment || comment.isDeleted) {

      return res.status(404).json({

        success:false,

        message:"Comment not found"

      });

    }


    comment.likes =
(comment.likes || []).filter(

      (userId)=>

      userId.toString() !==
      req.user._id.toString()

    );


    await comment.save();


    return res.json({

      success:true,

      message:"Like removed successfully",

      totalLikes:comment.likes.length

    });


  } catch(error){

    console.error(error);


    return res.status(500).json({

      success:false,

      message:"Server Error"

    });

  }

};
// ======================================
// Check Like Status
// GET /api/comments/:id/check-like
// ======================================

exports.checkLike = async (req,res)=>{

try{

const {id}=req.params;


if(!mongoose.Types.ObjectId.isValid(id)){

return res.status(400).json({

success:false,
message:"Invalid Comment ID"

});

}



const comment = await Comment.findById(id);



if(!comment || comment.isDeleted){

return res.status(404).json({

success:false,
message:"Comment not found"

});

}



const liked = req.user
?
(comment.likes || []).some(

(userId)=>

userId.toString() ===
req.user._id.toString()

)
:
false;



return res.json({

success:true,

liked,

totalLikes:
comment.likes?.length || 0
});


}
catch(error){

console.error(error);

return res.status(500).json({

success:false,

message:"Server Error"

});

}

};