const mongoose = require("mongoose");
const Schema = mongoose.Schema; // mongoose.schema se bnate h n schema to iko kan aaram krne ke liye variable me stroe kr lia bar bar likhna n pde
const  Review = require("./review.js");
// create schema 
const listingSchema = new Schema({
    title:{
     type : String,
     required :  true,
     },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
        // ye null ya undefind jb kuch nhi hoga to default ye value lega
        set : (v) => v === "" ? "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80": v,
        // mean teanary op use kia h image ki value khali hui user ke side se to default link set nhi to full h def
        //  khali nhi h to v jo use value oass kr rha h vo image set higi  
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review"
        },
    ],
});


// hm yha middleware bna rhe h ki jb listing delete ho rhih to uske sath uska review bhi delete hi jaye
// ye post middle ware h deletion ke liye listing delete hone ke baad kam krna h to post use hua h  
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
       await Review.deleteMany({_id : {$in: listing.reviews}})
    }
}); 

// create model 
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;