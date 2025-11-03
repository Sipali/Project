const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// validate for review
const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join (","); // erro ke and kafi sari object form me detail aarhi h ye line unhi detail pe map kr rhih to seareate , se join kr rha h kbhi addtions erro detail aati h to show ho jayeaga
    throw new ExpressError(400,errMsg);
  } else{
    next();
  }
};

//review post route
router.post("/" , validateReview,wrapAsync(async (req,res) =>{
  let listing =  await  Listing.findById(req.params.id);
  let newReview = new Review (req.body.review); // ye jo new Review h ye model name h or reqbody me jo review h aa rha hshow.ejs s=file se review object
  listing.reviews.push(newReview);
  
   await newReview.save();
  await listing.save();
  // console.log("new review saved");
  // res.send("new review saved");
  res.redirect(`/listings/${listing._id}`);
}));  

// review delete route

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;