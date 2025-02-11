const Listing = require("../models/listing.js")

module.exports.index =async(req,res)=>{
        const alllistings = await Listing.find({});
        res.render('listings/index.ejs', {alllistings});
    
    
}
module.exports.renderNewform = async(req, res)=>{
        res.render('listings/new.ejs' );
   
}

module.exports.showListing =async(req, res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate({path :"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash('error'," listing you are finding does not exist")
        res.redirect('/listings');
        
    }
    console.log(listing);
    res.render('listings/show.ejs', {listing});
}

module.exports.renderEditform =async(req, res)=>{
    let {id} =req.params;
    req.flash('success'," listing edited successfully")
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}

module.exports.createListing = async(req,res)=>{
    let url =req.file.path;
    let filename = req.file.filename;

    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image = {url ,filename}
    await newlisting.save();
    req.flash('success',"new listing created successfully")
    res.redirect('/listings');
}

module.exports.updateListing =async(req, res)=>{
    let {id} =req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url =req.file.path;
       let filename = req.file.filename;
        listing.image = {url ,filename};
        await listing.save();
    }
    
    req.flash('success'," listing updated successfully")
    
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing =async(req, res)=>{
    let {id} =req.params;
    req.flash('success'," listing deleted successfully")
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
 }