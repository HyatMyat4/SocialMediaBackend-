const express = require('express');
const verifyToken =require('../middleware/verifyToken')
const { 
    getUser,
    RemoveFriends,
    getUsersFriends,
    addRemoveFriends,
    SearchUser
} = require('../controllers/users')
const router = express.Router();

router.get("/:id", verifyToken , getUser);

router.get("/:id/friends", getUsersFriends);

router.post("/Search/friends", verifyToken , SearchUser);

router.patch("/:id/:friendsId", verifyToken , addRemoveFriends )

router.patch("/:id/:friendsId/remove", verifyToken , RemoveFriends )

module.exports = router;