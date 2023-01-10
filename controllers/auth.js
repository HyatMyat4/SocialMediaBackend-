const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/User")

 const register = async (req , res ) => {
   try{
    const {
        firstName,
        lastName,
        email,
        password,        
        friends,
        picturePath,
        location, 
        job,      
    } = req.body;
    if( !firstName  ||!email ||!password  ||!location || !picturePath || !job   ) {
        console.log(firstName , email ,password ,location)
           return res.status(400).json({ message: "All fields are required "})     
        }
        const duplicate = await User.findOne({ email }).lean().exec()

        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate Email' })
        }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
        firstName,
        lastName:lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,   
        job,    
        viewedProfile: Math.floor(Math.random() * 50000),
        impressions: Math.floor(Math.random() * 30000)
    });    
    const saveUser = await newUser.save();
    if(newUser){
        res.status(201).json("User Create Complete...")
    }
 }catch (err) {
    res.status(500).json({message: err.message})
   }
}

const login = async (req, res) => {
    try{
      const { email , password } = req.body;
      if(!email || !password) return res.status(400).json({message: "Email and Password are Require"})
      const user = await User.findOne({email: email })
      if(!user) return res.status(400).json({msg: "User dose not exist."})
      const isMatch =  bcrypt.compare(password,user.password)
      
      if(!isMatch) return res.status(400).json({message: "Invalid Password..."})
       
      const token = jwt.sign({id: user._id},process.env.JWT_SECRET )
         

      res.status(200).json({token , user  })     
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}


module.exports = {register , login , logout}
