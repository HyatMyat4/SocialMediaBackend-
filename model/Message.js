const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    friendsId:{
        type: String,
        require: true,
    },
    friendsfirstName: {
        type: String,
        require: true,
    },
    friendslastName: {
        type: String,
        require: true,
    },    
    userfirstName: {
        type: String,
        require: true,
    },
    userlastName: {
        type: String,
        require: true,
    },    
    userPicturePath: String,
    userlocation:String,
    userjob:String,
    FriendsPicturePath: String,
    friendslocation:String,
    friendsjob:String,
    Message:{
        type: Array,
        default: [],
    }

}, {timestamps: true});


module.exports = mongoose.model("Message", messageSchema);