const mongoose = require("mongoose");

const Review = require("../../models/Review");


// ======================================
// Like Review
// POST /api/reviews/:id/like
// ======================================

exports.likeReview = async (req, res) => {

  try {

    const { id } = req.params;


    // Validate Review ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        success:false,

        message:"Invalid Review ID"

      });

    }



    const review = await Review.findById(id);



    if (!review || review.isDeleted) {

      return res.status(404).json({

        success:false,

        message:"Review not found"

      });

    }



    const alreadyLiked =
      (review.likes || []).some(

        (userId) =>

          userId.toString() ===
          req.user._id.toString()

      );



    if (alreadyLiked) {

      return res.status(409).json({

        success:false,

        message:"Review already liked"

      });

    }



    if (!review.likes) {

      review.likes = [];

    }



    review.likes.push(req.user._id);



    await review.save();



    return res.status(200).json({

      success:true,

      message:"Review liked successfully",

      totalLikes:review.likes.length

    });



  } catch(error) {


    console.error(
      "Like Review Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:"Server Error"

    });


  }

};





// ======================================
// Unlike Review
// DELETE /api/reviews/:id/like
// ======================================

exports.unlikeReview = async (req,res)=>{

  try {


    const { id } = req.params;



    // Validate Review ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        success:false,

        message:"Invalid Review ID"

      });

    }



    const review =
      await Review.findById(id);



    if (!review || review.isDeleted) {

      return res.status(404).json({

        success:false,

        message:"Review not found"

      });

    }



    review.likes =
      (review.likes || []).filter(

        (userId) =>

          userId.toString() !==
          req.user._id.toString()

      );



    await review.save();



    return res.status(200).json({

      success:true,

      message:"Review like removed",

      totalLikes:review.likes.length

    });



  } catch(error) {


    console.error(
      "Unlike Review Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:"Server Error"

    });


  }

};






// ======================================
// Check Like Status
// GET /api/reviews/:id/check-like
// ======================================

exports.checkLike = async(req,res)=>{

  try {


    const { id } = req.params;



    // Validate Review ID

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({

        success:false,

        message:"Invalid Review ID"

      });

    }




    const review =
      await Review.findById(id);



    if (!review || review.isDeleted) {

      return res.status(404).json({

        success:false,

        message:"Review not found"

      });

    }




    const liked = req.user

    ?

    (review.likes || []).some(

      (userId)=>

        userId.toString() ===
        req.user._id.toString()

    )

    :

    false;





    return res.status(200).json({

      success:true,

      liked,

      totalLikes:
      review.likes?.length || 0

    });



  } catch(error) {


    console.error(
      "Check Like Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:"Server Error"

    });


  }

};