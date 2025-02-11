const express =require('express');
const router =express.Router({mergeParams: true}); 
const WrapAsync = require('../utils/wrapasync.js');
const { reviewSchema} =require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require('../utils/ExpressError.js');

const Listing = require('../models/listing.js');
const { isLoggedin, isReviewAuthor } = require('../middleware.js');

const reviewController =require("../controllers/reviews.js");

//review route

router.post("/",isLoggedin,WrapAsync(reviewController.createReview));


 //review -> delete route 

 router.delete("/:reviewId",isLoggedin,isReviewAuthor,WrapAsync(reviewController.deleteReview));

module.exports =router;