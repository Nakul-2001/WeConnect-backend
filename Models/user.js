const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],
    },
    profilepic:{
        type:String,
    },
},{timestamps:true});

const User = mongoose.model("User",userSchema);

module.exports = User;