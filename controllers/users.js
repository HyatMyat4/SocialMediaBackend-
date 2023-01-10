const User = require('../model/User')
const bcrypt = require('bcrypt');
const { severpusher } = require('./pusher')
const getUser = async (req , res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            res.status(401).json({message: "soorty User not found make sure params id"})
        }
        res.status(200).json(user);
    }catch(err) {
        res.status(404).json({message: err.message});
    }
}
const updateUser = async  (req, res ) => {
    try{
        const { Instgram ,
                Linkin ,
                Twitter ,
                backgrounpicture ,
                email ,
                facebooklink ,
                 firstName ,
                 friends ,
                  impressions ,
                  job,
                  lastName,
                  location,
                  password,
                  picturePath,
                  viewedProfile,

           
        
        } = req.body
        const { id } = req.params;
        const user = await User.findById(id);
        if( !picturePath){
            res.status(401).json({message: "picturePath Are require"})
        }
        if( !id ){
            res.status(401).json({message: "Params id Are require"})
        }
        if(!user){
            res.status(401).json({message: "Soorty User not found make sure params id"})
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        user.picture = picturePath;
        user.Linkin = Linkin,
        user.Instgram = Instgram,
        user.Twitter = Twitter,
        user.backgrounpicture = backgrounpicture,
        user.email = email,
        user.facebooklink = facebooklink,
        user.firstName = firstName,
        user.friends = friends,
        user.impressions = impressions,
        user.job = job,
        user.lastName = lastName,
        user.location = location,      
        user.viewedProfile = viewedProfile, 
        user.password = passwordHash



        const complete = await user.save();
        if(complete){
            res.status(200).json(user);
        }
    }catch(err) {
        res.status(404).json({message: err.message});
    }
}

const getUsersFriends = async (req , res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            res.status(401).json({message: "soorty not found User"})
        }
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        if(!user){
            res.status(401).json({message: "soorty not found User"})
        }
            const formattedFriends =  friends.map(
                ({ _id, firstName , lastName , occupation , location , picturePath}) => {
                    return { _id, firstName , lastName , occupation , location , picturePath }
                }
            );
        res.status(200).json(formattedFriends)       
    } catch (err) {
        res.status(404).json({message: err.message});
    }

}

const addRemoveFriends = async (req , res) => {
    try{
        const { id , friendsId } = req.params;
        const user = await User.findById(id);   
        
        const friend = await User.findById(friendsId);
     
        if(!user || !friend ){
            res.status(401).json({message: "soorty not found User make sure params id"})
        }
        if (user.friends.includes(friendsId)) {
            user.friends = user.friends.filter((id) => id !== friendsId);
            friend.friends = friend.friends.filter((id) => id !== id);
          } else {
            user.friends.push(friendsId);
            if(!friend.friends.includes(id)){
                friend.friends.push(id);
            }            
          }

        await user.save();
        await friend.save();

        const friends =  await Promise.all(
            user.friends.map((id) => User.findById(id))
        )
        
        const formattedFriends = friends.map(
            ({ _id, firstName , lastName , job , location , picturePath}) => {
                return { _id, firstName , lastName , job , location , picturePath }
            }
        );
         if(!formattedFriends){
            res.status(401).json({message: "not have formattedFriends"})
         }
         const usernew = await User.findById(id);
          const friendsdata = usernew.friends
        res.status(200).json({formattedFriends:formattedFriends , friendsdata:friendsdata})

    }catch (err) {
        res.status(403).json({message: err.message});
    }
}

const RemoveFriends = async (req , res ) => {
    try{
        const { id , friendsId } = req.params;
        const user = await User.findById(id);   
        
        const friend = await User.findById(friendsId);
        if(!user || !friend ){
            res.status(401).json({message: "soorty not found User make sure params id"})
        }
    
            user.friends = user.friends.filter((id) => id !== friendsId)
            friend.friends = friend.friends.filter((id) => id !== id)           
       

        await user.save();
        await friend.save();

        const friends =  await Promise.all(
            user.friends.map((id) => User.findById(id))
        )
        
        const formattedFriends = friends.map(
            ({ _id, firstName , lastName , job , location , picturePath}) => {
                return { _id, firstName , lastName , job , location , picturePath }
            }
        );
         if(!formattedFriends){
            res.status(401).json({message: "not have formattedFriends"})
         }
         const usernew = await User.findById(id);
          const friendsdata = usernew.friends
        res.status(200).json({formattedFriends:formattedFriends , friendsdata:friendsdata , friendsId:friendsId})
      
    } catch (err) {
        res.status(403).json({message: err.message});
    }
}


const SearchUser = async (req , res ) => {
  try{
    const { SearchValue } = req.body;
    const user = await User.find()
    if(!user){
        return res.status(404).json({message: 'some thing is wroung please try again'})
    }
    if(!SearchValue){
        res.status(401).json({message: "soorty not found SearchValue"})
    }
    
    const SearchFriends = user.filter((user) => user.firstName.toLowerCase().includes(SearchValue.toLowerCase()) || user.lastName.toLowerCase().includes(SearchValue.toLowerCase())) 
    
    if(!SearchFriends.length){
        return res.status(404).json({message: "User not found"})
    }else{
        res.status(200).json(SearchFriends)
    }

  } catch (err) {
     res.status(404).json({message: err.message});
  }
}



module.exports = { getUser, getUsersFriends, addRemoveFriends , updateUser , RemoveFriends , SearchUser}
