const express = require('express');
const router =express.Router();
const verifyToken =require('../middleware/verifyToken')
const { setProfilePic } = require('../controllers/setProfilePic')

router.post("/setProfilePic" , setProfilePic );

module.exports = router;