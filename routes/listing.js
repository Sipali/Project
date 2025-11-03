const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// validation for server side to handle the error and show to error .ejs template
const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join (","); // erro ke and kafi sari object form me detail aarhi h ye line unhi detail pe map kr rhih to seareate , se join kr rha h kbhi addtions erro detail aati h to show ho jayeaga
    throw new ExpressError(400,errMsg);
  } else{
    next();
  }
};
// index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings =   await Listing.find({});
    res.render("./listings/index",{allListings});
}));
// create new post form render
router.get("/new", (req,res)=>{
    res.render("./listings/new.ejs");
});
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
     const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
}));

// show route
router.get("/:id", wrapAsync(async ( req, res) => {
    let {id} = req.params;
   const  listing =  await Listing.findById(id).populate("reviews");
  //  console.log(listing);
     const allListings = await Listing.find().populate("reviews");// ye sb all listing data refer kr rhs h jiise review me sb data listing ka review har page pe show krega 
   res.render("./listings/show.ejs", {listing,allListings}); // 
}));

// edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await  Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));
// update  route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    // if(req.body.listing){
    //     throw new ExpressError(404, "send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

// delete route
router.delete("/:id",wrapAsync (async (req,res)=>{
    let {id} = req.params;
      let deletedListing =  await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
}));

module.exports = router;