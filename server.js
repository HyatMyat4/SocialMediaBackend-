require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser") ;
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const DatabaseConnect = require('./config/DatabaseConnect')
const verifyToken = require('./middleware/verifyToken')
const  { register } =require ('./controllers/auth')
const { createPost } = require('./controllers/post.js')
const User = require("./model/User")
const Post = require("./model/Post")
const { users , posts } = require("./data/index")
const expressfileupload = require('express-fileupload')
const { setProfilePic } = require('./controllers/setProfilePic')
const { updateUser } = require('./controllers/users')
const { deleteImage } =require('./controllers/post')

const app = express();
DatabaseConnect()
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb" , extended: true}));
app.use(cors());

const PORT = process.env.PORT || 3000 ;

// Routes//



app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require("./routes/root"))

app.use('/auth', require('./routes/authRoute'))

app.use('/users', require('./routes/usersRoute'))

app.use("/posts", require('./routes/postRoutes'))

app.use("/Message" , require('./routes/messageRoute'))

app.use("/image",require('./routes/imageRoute'))

app.use("/img", express.static(path.join(__dirname, "Photo/img")));

// User Upload Image  Store Here //
const storage = multer.diskStorage({
    destination: function (req , file , cb ) {
        cb(null , "Photo/img"); // here //
    },
    filename: function (req , file , cb ) {
        cb(null , file.originalname);
        console.log(file)
    }
})
const upload = multer({storage});

app.patch('/users/:id' , upload.single("picture") ,updateUser)

app.post('/upload', upload.single("picture") ,setProfilePic)

app.post("/auth/register", upload.single("picture"), register);
app.delete("/deletePhoto",  deleteImage);


mongoose.connection.once('open', () => {
    console.log('Connect To MongoDb  Complete..')
    app.listen(PORT, () => console.log(`💻Server running on ${PORT}🔥🔥🚀🚀`))
  
})

mongoose.connection.on('error', err => {
    console.log(err);        
})
