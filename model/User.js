const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        min: 3,
        max:15,
    },
    lastName:{
        type: String,
        default: "",
        min: 3,
        max:15,
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max:50,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        min: 8,        
    },
    picturePath:{
        type: String,        
        default: "",
    },
    backgrounpicture:{
        type: String,
        default: "",
    },
    facebooklink:{
        type: String,
        default: "",
    },
    Twitter:{
        type: String,
        default: "",
    },
    Instgram:{
        type: String,
        default: "",
    },
    Linkin:{
        type: String,
        default: "",
    },
    friends:{
        type: Array,
        default: [],       
    },
    location:String,    
    job:String,
    viewedProfile: Number,
    impressions: Number,
    

}, { timestamps: true })

module.exports = mongoose.model("User" , UserSchema);

