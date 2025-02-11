const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

main().then(()=>{
    console.log("connected succesfully");
}).catch(err => console.log(err));
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB =async ()=>{
    await Listing.deleteMany({});//first delete old data
    initdata.data =initdata.data.map((obj)=> ({...obj, owner :'679b7f0afed567f96e7851f2'}))
    await Listing.insertMany(initdata.data);//then insert new data 
    console.log("data was intialized");
   
}
initDB();