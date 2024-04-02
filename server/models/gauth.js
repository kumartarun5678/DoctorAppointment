const mongoose = require("mongoose");

const user = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String
},{timestamps:true});

const Guser = mongoose.model("GUser", user);

module.exports = Guser;