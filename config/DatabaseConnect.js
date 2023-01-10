const mongoose = require('mongoose');
const express = require('express')
const app = express();
const DatabaseConnect = async () => {   
    try{
        await mongoose.connect(process.env.DATABASE_URI)
    }catch(err) {
        console.log(err)
    }
        
  
}

module.exports = DatabaseConnect