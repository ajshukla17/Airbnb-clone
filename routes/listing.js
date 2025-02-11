const express =require('express');
const router =express.Router();
const WrapAsync = require('../utils/wrapasync.js');
const {listingSchema} =require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {isLoggedin, isOwner} = require('../middleware.js');
const ListingController = require('../controllers/listings.js');
const multer  = require('multer')
const {storage} =require('../cloudconfig.js');
const upload = multer({ storage })


router.route("/")
.get(WrapAsync(ListingController.index))//index route
.post(isLoggedin,upload.single("listing[image]"),WrapAsync(ListingController.createListing))//create route


//new route
router.get("/new",isLoggedin,ListingController.renderNewform);

//edit route
router.get("/:id/edit", isLoggedin,isOwner,upload.single("listing[image]"),
WrapAsync(ListingController.renderEditform));

router.route("/:id")
.get(WrapAsync(ListingController.showListing))  //show route
.put(isLoggedin,isOwner,WrapAsync(ListingController.updateListing)) //update route
.delete(isLoggedin,isOwner,WrapAsync(ListingController.deleteListing)); //delete route


 
 module.exports = router;