const express = require('express')
const Post = require('../model/Post')
const User = require('../model/User')
const { severpusher } = require('./pusher')
const fs = require('fs')
const { v4: uuidv4  } = require('uuid');
const deleteimg = (path1) => {
    fs.unlink(path1, (err) => {
        if (err) {
        console.error(err)
        return
        }
        //file removed
    })
}

const createPost = async (req,res) => {
    try{
        const {
            userId ,
            description,
            picturePath 
        } = req.body;  
        if(!userId || !description || !picturePath){
            return res.status(400).json({
                message: 'userId or description or picturePath is required'
            })
        }
       const user = await User.findById(userId);
       if(!user) {
         return res.status(400).json({message:"User not found"});
       }
       const newPost = new Post({
        userId,
        firstName : user.firstName,
        lastName : user.lastName,
        location : user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,        
        like: {},
        comments: []
       })

       await newPost.save();

        const post = await Post.find();
        
        res.status(201).json(post)
        severpusher.trigger('comment', 'new-comment',post)
    }catch(err) {
        res.status(409).json({message: err.message});
    }
}

const getFeedPosts = async (req , res) => {
    try{
        const post = await Post.find();
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: "Some thing wroung Post not Found"})
        }
        
    } catch(err) {
        res.status(404).json({message: err.message});
    }
}

const getUserPosts = async (req , res) => {
    try{
        const { userId } = req.params;
        const post = await Post.find({userId});
        if(!post){
            return res.status(401).json({message: "Soort Not have Post"});
        }
        res.status(200).json(post);
    }catch (err) {
        res.status(401).json({message: err.message});
    }
}


const likePost = async (req , res ) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if(!id){
         return res.status(404).json({message: "Postid  are require" })
        }
        if(!userId){
         return res.status(404).json({message: "userId  are require" })
        }
        const post = await Post.findById(id);
        if(!post){
          return res.status(404).json({message: "Post not Found"})
        }
        const isLiked = post.like.get(userId);

        

        if(isLiked) {
            post.like.delete(userId);
        }else{
            post.like.set(userId, true);
        }

        const updatePost = await Post.findByIdAndUpdate(id,
            {like: post.like},
            {new: true})
            if(!updatePost){
                res.status(404).json({message: "Soorty UpdatePost Not Found"});
            }
            res.status(200).json(updatePost);
            severpusher.trigger('comment', 'new-comment',updatePost)
    } catch (err) {
        res.status(403).json({message: err.message});
    }
}

const commentPost = async (req , res ) => {
    try{
       const { id } = req.params;
       const { 
        userId ,
        comment,        
        } = req.body;
       if(!id){
        return res.status(404).json({message: "Postid  are require" })
       }
       if(!  userId || !comment ){
        return res.status(404).json({message: "userId and comment  are require" })
       }
       const post = await Post.findById(id);
       const user = await User.findById(userId);
       if(!post){
        return res.status(404).json({message: "Post not Found"})
      }
       if(!user){
        return res.status(404).json({message: "user not Found"})
      }
      const newComment = {
        userId,
        createat: new Date(),
        firstName : user.firstName,
        lastName : user.lastName,        
         comment :comment,
        userPicturePath: user.picturePath, 
        _id:id,
        commentid:uuidv4(),        
       }
       if(!newComment){
        return res.status(404).json({message: "Some thing wroung Comment not Found"})        
       }
       post.comments.push(newComment)

       await post.save();
       const newpost = await Post.findById(id);
        res.status(200).json(newpost);
        severpusher.trigger('comment', 'new-comment',newpost)
    }catch (err) {
        res.status(403).json({message: err.message});
    }
}

const deletePost = async ( req , res ) => {
try{
    const { id } = req.params;
    if(!id){
        return res.status(404).json({message: "Postid  are require" })
    }
    const post = await Post.findById(id).exec()
    if(!post){
        return res.status(404).json({message: "Post not Found"})
    }
        const path1 = `./Photo/img/${post.picturePath}`
        deleteimg(path1)
    const result = await post.deleteOne()

    const reply = ` ${result.description} Post is Deleted Complete...`
     
    const data = {
        reply: reply,
        id:id
    }
    res.json(data)
    severpusher.trigger('comment', 'new-comment',data)    
}catch (err) {
    res.status(403).json({message: err.message});
}
}

const deleteImage = async (req, res) => {
    try{
      
        const { picturepath } = req.body;
        if(!picturepath){
            return res.status(404).json({message: "Postid  are require" })
        }
        const path1 = `./Photo/img/${picturepath}`
        deleteimg(path1)
        const data = { reply:'Image delete Success..'}
        res.json(data)
    } catch (err) {
        res.status(403).json({message: err.message});
    }
} 

const deleteComment = async (req , res) => {
    try{
        const { commentid , _id  } = req.params;
        if(!commentid){
            return res.status(404).json({message: "commentid  are require!" })
        }
        const post = await Post.findById(_id);
        if(!post){
            return res.status(404).json({message: "Post Not Found!" })
        }
        post.comments = post.comments.filter((id) => id.commentid !== commentid)
        
        await post.save();

        const updatepost = await Post.findById(_id);

        const data = { reply:'Comment delete Success..' , updatepost : updatepost}
        res.json(data)
        severpusher.trigger('comment', 'new-comment',data)
    } catch (err) {
        res.status(403).json({message: err.message});
    }
}

const updatePost = async (req , res) => {
    try{
        const { postid , picturepath , dis} = req.body;
        if(!postid || !dis){
            return res.status(404).json({message: "description  and picturepath  are required"})
        }
        const post = await Post.findById(postid);
        if(!post){
            return res.status(404).json({message: "Post Not Found!" })
        }

        post.description = dis
        post.picturePath = picturepath
   
        post.save()
        const updatePost = await Post.findByIdAndUpdate(postid,
            {description: post.description},          
            {new: true})
            if(!updatePost){
                res.status(404).json({message: "Soorty UpdatePost Not Found"});
            }
            const updatepost = await Post.findById(postid);
            res.json(updatepost)
    } catch (err) {
        res.status(403).json({message: err.message});
    }
}

const updateComment = async (req, res) => {
    try{
       const { commentid , Postid , updatecomment } = req.body;
       if(!commentid || !Postid ) return res.status(404).json({message: 'Comment id , updatecomment and Postid are required'})
       const post = await Post.findById(Postid);
       if(!post) return res.status(404).json({message: 'Post Not Found'})
       post.comments.map(comment => {
           if(comment.commentid === commentid){
             comment.comment = updatecomment
             return comment             
           }
       }) 
       post.save()
       const updatePost = await Post.findByIdAndUpdate(Postid,
        {comments: post.comments},          
        {new: true})
        if(!updatePost){
            res.status(404).json({message: "Soorty UpdatePost Not Found"});
        }
        const updatepost = await Post.findById(Postid);
        res.json(updatepost)
    }catch (err) {

    }
}
    
module.exports = {
    createPost,
    getFeedPosts,
    getUserPosts,
    likePost,
    commentPost,
    deletePost,
    deleteImage,
    deleteComment,
    updatePost,
    updateComment
}