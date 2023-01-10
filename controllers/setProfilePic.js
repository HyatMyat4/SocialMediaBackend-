
const setProfilePic = (req , res , next ) => {
console.log(req.files)

res.status(200).json({message: "setimgsuccess"})

};

module.exports = { setProfilePic }