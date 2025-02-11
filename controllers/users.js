const User = require('../models/user.js');

module.exports.rendersignupform =(req,res)=>{
    res.render('./listings/signup.ejs');
}

module.exports.signup =async(req,res)=>{
    try{
        let {username,password,email} =req.body;
        const newUser =new User({email,username});
        const regUser =await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash('success',"account created successfully");
            res.redirect('/listings');
        });
        
    }catch(e){
            console.error("Signup Error:", e);
            req.flash('error', e.message);  // Display error message
            res.redirect('/signup');
        
    }
   
}

module.exports.renderloginform =async(req,res)=>{
    res.render('./listings/login.ejs');
}

module.exports.login =async(req,res)=>{
    req.flash("success",'welcome back to airbnb');
    let redirectUrl =res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.logout =async(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success',"Logged out successfully")
        res.redirect('/listings');
    });
    
 
}