const express = require('express');
const verifyToken =require('../middleware/verifyToken')
const router = express.Router();
const {
    createPost,
    getFeedPosts ,
    getUserPosts ,
    likePost ,
    commentPost,
    deletePost,
    deleteComment,
    updatePost,
    updateComment
    
} = require('../controllers/post')

router.get('/', verifyToken, getFeedPosts)

router.post('/createPost', verifyToken, createPost)

router.post('/:id/comment', verifyToken, commentPost)

router.get("/:userId/posts", verifyToken, getUserPosts)

router.patch('/:id/like', verifyToken, likePost)   

router.patch('/updateComment', verifyToken, updateComment)   

router.patch('/UpdatePost', verifyToken, updatePost)   

router.delete('/:id/delete', verifyToken, deletePost)   

router.delete('/:commentid/:_id/comment', verifyToken, deleteComment)   

 



module.exports = router;
