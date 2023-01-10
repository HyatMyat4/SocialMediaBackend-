const express = require('express');
const router = express.Router();
const verifyToken =require('../middleware/verifyToken')
const { 
    newMassageGroup,
    GetAllMessageGroup,
    getSingleMessageGroup,
    newMessage
} = require('../controllers/Message')


router.post('/newMessage', verifyToken ,  newMassageGroup)

router.post('/newsingleMessage', verifyToken ,  newMessage)

router.get('/:id/AllMessageGroup', verifyToken ,  GetAllMessageGroup)

router.get('/:id/singleGroup', verifyToken ,  getSingleMessageGroup)

module.exports = router;