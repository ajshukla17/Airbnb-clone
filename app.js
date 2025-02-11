if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const Listing = require('./models/listing.js');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOveride = require('method-override');
const ejsMate =require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const WrapAsync = require('./utils/wrapasync.js');
const Joi = require('joi');
const {listingSchema , reviewSchema} =require("./schema.js");
const Review = require("./models/review.js");
const wrapasync = require('./utils/wrapasync.js');
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User =require('./models/user.js');
const passport =require('passport');
const LocalStrategy = require('passport-local');




const listingRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");
app.use(methodOveride("_method"));





const dbUrl =process.env.ATLASDB_URL

main().then(()=>{
    console.log("connected succesfully");
}).catch(err => console.log(err));
async function main(){
     await mongoose.connect(dbUrl);
}
//ejs
app.use(express.static(path.join(__dirname,"/public")))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:true }));//parse krenge ke liye mtlb ki database se kuch obj lene ke liye(data jo req ke ander a ra hai wo parse ho pae)
app.engine("ejs",ejsMate);


const validateReview =(req,res,next)=>{
    let {error }=reviewSchema.validate(req.body);
    if(error){
        let errmsg =error.details.map((el)=>el.message).join(".")
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}


const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
        
    },
    touchAfter:24 *3600,
    
})

store.on("error",()=>{
    console.log("error in mongo session store");
})


const sessionoption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,

    }
}

app.use(session(sessionoption));
app.use(flash());


app.use(passport.initialize());//har req ke liye passport initialize hojaega
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//storing in session
passport.deserializeUser(User.deserializeUser());//removing from session




app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.CurrUser = req.user;

    next();

})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews" ,reviewsRouter);
app.use("/",userRouter)




//error handling
app.all("*",(req, res,next)=>{
    next(new ExpressError("Page Not Found",404,));
})

app.use((err,req, res,next)=>{
    let { status=500 ,message="something went wrong"} =err;
    //res.status(status).send(message);
    res.status(status).render('listings/error.ejs',{message});
})

//server
app.listen(8080,()=>{
    console.log('Server is running on port 8080');
});