const express = require('express')
const { v4: uuidv4  } = require('uuid');
const User = require('../model/User')
const Message = require('../model/Message')
const { severpusher } = require('./pusher')
const GetAllMessageGroup = async (req , res ) => {
    try{
        const {id} = req.params
        const MsgGroup = await Message.find(); 
        const onlyusermsggroup =  MsgGroup.filter((msg) => msg.userId === id || msg.friendsId === id )
        if(MsgGroup){  
            console.log(onlyusermsggroup)
         if(onlyusermsggroup) {
            console.log(onlyusermsggroup)
            res.status(200).json(onlyusermsggroup);
         }
        }else{
            res.status(404).json({message: "Some thing wroung MsgGroup not Found"})
        }
    } catch (err) {
        res.status(403).json({message: err.message});
    }
}

const getSingleMessageGroup = async (req , res ) => {
     try{
       const { id } = req.params;
       if(!id) {
       return res.status(404).json({message: 'Group Params is not Found!'});
       }
       const singleGroup = await Message.findById(id)
       if(singleGroup){
        res.status(200).json(singleGroup);
    }else{
        res.status(404).json({message: "Some thing wroung singleGroup not Found"})
    }
     }catch (err){
         res.status(403).json({message: err.message});
     }
}

const  newMassageGroup = async (req , res) => {
    try{
      const { userid ,  Friendsid } = req.body
      if(!userid  || !Message ){
         return res.status(404).json({message: ' userid ,  Friendsid , Message is required'})
      }
      const user = await User.findById(userid)
      const Friends = await User.findById(Friendsid)
     if(!user || !Friends ) return res.status(404).json({message: 'User and Friends Not Found'})
      const newMessageGroup = new Message({
        userId:userid,
        userfirstName: user.firstName  ,
        userlastName: user.lastName,    
        userPicturePath: user.picturePath,
        userlocation:user.location,
        userjob:user.job,
        friendsId:Friendsid,
        friendsfirstName:Friends.firstName,
        friendslastName:Friends.lastName,
        FriendsPicturePath:Friends.picturePath,
        friendslocation:Friends.location,
        friendsjob:Friends.job,
        Message:[]
    })
    await newMessageGroup.save();

    const MessageAllGroup = await Message.find();
    const MessageGroup =  MessageAllGroup.filter((msg) => msg.userId === userid  )

    res.status(201).json(MessageGroup)
    }catch (err) {
        res.status(409).json({message: err.message});
    }
}

const newMessage = async (req , res ) => {
    try{
     const { GroupId , message , link , userId , img } = req.body
     if(!GroupId){
        return res.status(404).json({message: 'Some thing is wroung 404 NOT Found'})
     }
     const group = await Message.findById(GroupId)
     const user = await  User.findById(userId)
     if(!group || !user ){
        return res.status(404).json({message: 'Some thing is wroung 404 NOT Found Group'})
     }
     const newMessage = {
        userId,
        createat: new Date(),
        userId: user._id,     
        userFname: user.firstName,
        userLname: user.lastName,        
        Message :message,
        link: link,
        image:img,
        userPicturePath: user.picturePath,        
        commentid:uuidv4(),        
       }
       if(!newMessage){
        return res.status(404).json({message: "Some thing wroung Message not Found"})        
       }
       group.Message.push(newMessage)
       await group.save();
       
       const newgroup = await Message.findById(GroupId);
       res.status(200).json(newgroup);
       severpusher.trigger('Message', 'new-message',GroupId)
    }catch (err){
        res.status(403).json({message: err.message});
    }
}

module.exports = { newMassageGroup , GetAllMessageGroup  , getSingleMessageGroup , newMessage}