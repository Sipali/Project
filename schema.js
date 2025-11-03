// ye joi tool h jo server side validate me help krta h agr koi hosctoch se invalid data bhej rhah to to ye handle krega joi tool yha bs scehama bna rhe h phr app.js me require lrege mddleware bnayenge phr usko route ke anr call kremnge 
const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
         description: joi.string().required(),
          location: joi.string().required(),
           country: joi.string().required(),
            price: joi.string().required(),
            image: joi.string().allow('', null)

    }).required(),
});

// joi schema for review

module.exports.reviewSchema =  joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});