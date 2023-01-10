const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },    
    location:String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    like: {
        type: Map,
        of: Boolean,
    },
    comments:{
        type: Array,
        default: [],
      
    }

}, {timestamps: true}) ;

module.exports = mongoose.model("Post", postSchema);