const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');//methods add krdega model mai

const userSchema = new Schema({
    email:{
        type:String,
        required:true,    
    }
});

userSchema.plugin(passportLocalMongoose);//automatically adds username, hashing ,salting and password implement krdeta hai 

module.exports = mongoose.model('User',userSchema);