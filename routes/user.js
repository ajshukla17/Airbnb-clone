const express =require('express');
const router =express.Router();
const User =require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const usercontroller =require("../controllers/users.js")


router.route("/signup")
.get(usercontroller.rendersignupform)
.post(usercontroller.signup);

//login route
router.route("/login")
.get(usercontroller.renderloginform)
//login form
.post(saveRedirectUrl,passport.authenticate("local",
    ({failureRedirect: "/login" ,failureFlash:true})),usercontroller.login)

//logout route
router.get("/logout",usercontroller.logout);

module.exports=router;